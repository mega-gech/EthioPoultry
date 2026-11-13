import { Request, Response } from "express";
import axios from "axios";
import mongoose from "mongoose";
import { randomUUID } from "crypto";

import { randomBytes } from "crypto";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    // We'll add our logic here step by step.
    const userId = req.user?.userId;

    if (!userId || req.user?.role !== "buyer") {
  res.status(403).json({
    success: false,
    message: "Only buyers can make payments",
  });
  return;
}

const { orderId } = req.body;

if (!mongoose.Types.ObjectId.isValid(orderId)) {
  res.status(400).json({
    success: false,
    message: "A valid order ID is required",
  });
  return;
}

const order = await Order.findOne({
  _id: orderId,
  buyerId: userId,
});

if (!order) {
  res.status(404).json({
    success: false,
    message: "Order not found",
  });
  return;
}

if (order.status !== "Pending") {
  res.status(400).json({
    success: false,
    message: "This order is not available for payment",
  });
  return;
}

const successfulPayment = await Payment.findOne({
  orderId: order._id,
  status: "Successful",
});

if (successfulPayment) {
  res.status(400).json({
    success: false,
    message: "This order has already been paid",
  });
  return;
}

const pendingPayment = await Payment.findOne({
  orderId: order._id,
  status: "Pending",
});

if (pendingPayment) {
  res.status(409).json({
    success: false,
    message: "A payment attempt is already pending",
  });
  return;
}

const payment = await Payment.create({
  orderId: order._id,
  buyerId: userId,
  amount: order.totalAmount,
  currency: "ETB",
  method: "Simulated",
  transactionReference: randomUUID(),
  status: "Pending",
});

res.status(201).json({
  success: true,
  message: "Payment created successfully",
  data: payment,
});


  } catch (error) {
    console.error("create payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create payment",
    });
  }
};



export const initializeChapaPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId || req.user?.role !== "buyer") {
      res.status(403).json({
        success: false,
        message: "Only buyers can make payments",
      });
      return;
    }

    const { orderId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.status(400).json({
        success: false,
        message: "A valid order ID is required",
      });
      return;
    }

    const chapaSecretKey = process.env.CHAPA_SECRET_KEY;
    const frontendUrl = process.env.FRONTEND_URL;

    if (!chapaSecretKey || !frontendUrl) {
      res.status(500).json({
        success: false,
        message: "Chapa configuration is missing",
      });
      return;
    }

    // 1. Find the buyer's order
    const order = await Order.findOne({
      _id: orderId,
      buyerId: userId,
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    if (order.status !== "Pending") {
      res.status(400).json({
        success: false,
        message: "This order is not available for payment",
      });
      return;
    }

    // 2. Prevent duplicate successful payments
    const successfulPayment = await Payment.findOne({
      orderId: order._id,
      status: "Successful",
    });

    if (successfulPayment) {
      res.status(400).json({
        success: false,
        message: "This order has already been paid",
      });
      return;
    }

    // 3. Reuse an existing pending Chapa attempt.
    // This preserves the same idempotency key when retrying.
    let payment = await Payment.findOne({
      orderId: order._id,
      status: "Pending",
    });

    if (payment && payment.method !== "Chapa") {
      res.status(409).json({
        success: false,
        message: "Another payment attempt is already pending",
      });
      return;
    }

    // 4. Create a new Chapa payment if none is pending
    if (!payment) {
      const merchantReference =
        `EP${randomBytes(9).toString("hex")}`;

      payment = await Payment.create({
        orderId: order._id,
        buyerId: userId,
        amount: order.totalAmount,
        currency: "ETB",
        method: "Chapa",
        transactionReference: merchantReference,
        status: "Pending",
      });
    }

    // 5. Return an existing checkout URL if already initialized
    if (payment.checkoutUrl) {
      res.status(200).json({
        success: true,
        message: "Chapa checkout already initialized",
        data: {
          payment,
          checkoutUrl: payment.checkoutUrl,
        },
      });
      return;
    }

    // 6. Find buyer details
    const buyer = await User.findById(userId).select(
      "name email phone"
    );

    if (!buyer) {
      res.status(404).json({
        success: false,
        message: "Buyer account not found",
      });
      return;
    }

    const nameParts = buyer.name.trim().split(/\s+/);

    const customer = {
      first_name: nameParts[0],
      last_name: nameParts.slice(1).join(" ") || nameParts[0],
      email: buyer.email,
      phone_number: buyer.phone,
    };

    // 7. Prepare the amount in ETB for Chapa v1
const amount = order.totalAmount.toString();

if (order.totalAmount < 1) {
  res.status(400).json({
    success: false,
    message: "Chapa requires a minimum payment of 1 ETB",
  });
  return;
}

 
// 8. Initialize checkout with Chapa v1
const chapaResponse = await fetch(
  "https://api.chapa.co/v1/transaction/initialize",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${chapaSecretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "ETB",
      email: buyer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone_number: buyer.phone,
      tx_ref: payment.transactionReference,
      return_url:
        `${frontendUrl}/payment/return?paymentId=${payment._id}`,
    }),
  }
);


    const chapaResult = await chapaResponse.json() as {
      status?: string;
      message?: string;
      data?: {
        checkout_url?: string;
      };
    };

    if (
      !chapaResponse.ok ||
      chapaResult.status !== "success" ||
      !chapaResult.data?.checkout_url
    ) {
      console.error("Chapa initialization failed:", chapaResult);

      res.status(502).json({
        success: false,
        message:
          chapaResult.message ||
          "Unable to initialize Chapa checkout. You can retry.",
      });
      return;
    }

    // 9. Save Chapa checkout information
    const checkoutUrl = chapaResult.data.checkout_url;

    payment.checkoutUrl = checkoutUrl;

    payment.providerReference =
      new URL(checkoutUrl).pathname.split("/").filter(Boolean).pop();

    await payment.save();

    res.status(201).json({
      success: true,
      message: "Chapa payment initialized successfully",
      data: {
        payment,
        checkoutUrl,
      },
    });

  } catch (error) {
    console.error("Chapa initialization error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to initialize Chapa payment",
    });
  }
};

export const verifyChapaPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { paymentId } = req.params;

    if (typeof paymentId !== "string") {
  res.status(400).json({
    success: false,
    message: "Invalid payment ID",
  });
  return;
}

    if (!userId || req.user?.role !== "buyer") {
  res.status(403).json({
    success: false,
    message: "Only buyers can verify their payments",
  });
  return;
}

if (!mongoose.Types.ObjectId.isValid(paymentId)) {
  res.status(400).json({
    success: false,
    message: "A valid payment ID is required",
  });
  return;
}

const payment = await Payment.findOne({
  _id: paymentId,
  buyerId: userId,
  method: "Chapa",
});

if (!payment) {
  res.status(404).json({
    success: false,
    message: "Chapa payment not found",
  });
  return;
}

if (payment.status === "Successful") {
  res.status(200).json({
    success: true,
    message: "Payment has already been verified",
    payment,
  });
  return;
}

const chapaSecretKey = process.env.CHAPA_SECRET_KEY;

if (!chapaSecretKey) {
  res.status(500).json({
    success: false,
    message: "Chapa configuration is missing",
  });
  return;
}

const chapaResponse = await axios.get(
  `https://api.chapa.co/v1/transaction/verify/${payment.transactionReference}`,
  {
    headers: {
      Authorization: `Bearer ${chapaSecretKey}`,
    },
  }
);

console.log(
  "Chapa verification response:",
  JSON.stringify(chapaResponse.data, null, 2)
);

const chapaData = chapaResponse.data.data;


if (
  !chapaData ||
  chapaData.tx_ref !== payment.transactionReference ||
  Number(chapaData.amount) !== payment.amount ||
  chapaData.currency !== payment.currency
) {
  res.status(400).json({
    success: false,
    message: "Chapa transaction details do not match our payment record",
  });
  return;
}


const chapaStatus = String(chapaData.status).toLowerCase();

if (chapaStatus !== "success") {
  const failedStatuses = [
    "failed",
    "cancelled",
    "canceled",
    "failed/cancelled",
  ];

  if (failedStatuses.includes(chapaStatus)) {
    payment.status = "Failed";

    if (chapaData.reference) {
      payment.providerReference = chapaData.reference;
    }

    await payment.save();

    res.status(200).json({
      success: false,
      message: "Chapa payment failed or was cancelled",
      payment,
    });
    return;
  }

  res.status(200).json({
    success: false,
    message: "Payment is not successful yet",
    payment,
  });
  return;
}



const session = await mongoose.startSession();

session.startTransaction();

try {
  payment.status = "Successful";
  payment.paidAt = new Date();

  if (chapaData.reference) {
    payment.providerReference = chapaData.reference;
  }

  await payment.save({ session });

  const order = await Order.findOne({
    _id: payment.orderId,
    buyerId: userId,
    status: "Pending",
  }).session(session);

  if (!order) {
    throw new Error("Order not found or is no longer pending");
  }

  order.status = "Confirmed";

  await order.save({ session });

  await session.commitTransaction();

  res.status(200).json({
    success: true,
    message: "Chapa payment verified successfully",
    data: {
      payment,
      orderStatus: "Confirmed",
    },
  });
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  await session.endSession();
}

  } catch (error) {
    console.error("Chapa verification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify Chapa payment",
    });
  }
};



export const simulatePayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId || req.user?.role !== "buyer") {
      res.status(403).json({
        success: false,
        message: "Only buyers can simulate payments",
      });
      return;
    }

    const { paymentId, result } = req.body;

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      res.status(400).json({
        success: false,
        message: "A valid payment ID is required",
      });
      return;
    }

    if (!["Successful", "Failed"].includes(result)) {
      res.status(400).json({
        success: false,
        message: "Invalid payment result",
      });
      return;
    }

   const payment = await Payment.findOne({
  _id: paymentId,
  buyerId: userId,
});

if (!payment) {
  res.status(404).json({
    success: false,
    message: "Payment not found",
  });
  return;
}

if (payment.status !== "Pending") {
  res.status(400).json({
    success: false,
    message: "This payment has already been processed",
  });
  return;
}

const session = await mongoose.startSession();

session.startTransaction();

try {
   payment.status = result;

if (result === "Successful") {
  payment.paidAt = new Date();
}

await payment.save({ session });

if (result === "Successful") {
  const order = await Order.findOne({
    _id: payment.orderId,
    buyerId: userId,
    status: "Pending",
  }).session(session);

  if (!order) {
    throw new Error("Order not found or is no longer pending");
  }

  order.status = "Confirmed";

  await order.save({ session });
}

await session.commitTransaction();

res.status(200).json({
  success: true,
  message: `Payment ${result.toLowerCase()} successfully`,
  data: {
    payment,
    orderStatus: result === "Successful" ? "Confirmed" : "Pending",
  },
});
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  await session.endSession();
}

  } catch (error) {
    console.error("simulate payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to simulate payment",
    });
  }
};


export const getMyPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Only buyers can view buyer payment history
    if (!userId || req.user?.role !== "buyer") {
      res.status(403).json({
        success: false,
        message: "Only buyers can view payment history",
      });
      return;
    }

    // Find payments belonging to the logged-in buyer
    const payments = await Payment.find({
      buyerId: userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });

  } catch (error) {
    console.error("Get payment history error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve payment history",
    });
  }
};
