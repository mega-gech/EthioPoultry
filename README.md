# EthioPoultry – Ethiopian Poultry & Egg Marketplace

EthioPoultry is a web-based marketplace designed to connect poultry farmers, egg sellers, buyers, and agricultural service providers across Ethiopia.

The platform aims to make it easier for users to discover poultry products, compare prices, find local sellers, and connect directly with suppliers.

## Features

* Browse, search, filter, and sort products loaded from the backend API
* View product details and seller information from MongoDB
* Seller product creation, editing, and deletion backed by the API
* Buyer favorites persisted to the buyer account
* 📍 Find sellers by location
* 📱 Responsive design for desktop and mobile devices
* 🤝 Connect buyers with local farmers and suppliers

## Technology Stack

**Frontend**

* React
* Vite
* Tailwind CSS
* type script
* Lucide React icons

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* TypeScript

## Project Structure

```text
EthioPoultry/
├── client/
│   └── src/
├── server/
│   └── src/
│       ├── controllers/
│       ├── models/
│       └── routes/
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

* Node.js and npm
* Git
* A code editor such as Visual Studio Code

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mega-gech/EthioPoultry.git
   ```

2. Navigate to the project folder:

   ```bash
   cd EthioPoultry
   ```

3. Configure the backend environment in `server/.env`. Required variables:

   ```bash
   PORT=5000
   MONGO_URI=<your MongoDB connection string>
   JWT_SECRET=<a long random secret>
   SESSION_SECRET=<a different long random secret>
   GOOGLE_CLIENT_ID=<your Google OAuth client ID>
   GOOGLE_CLIENT_SECRET=<your Google OAuth client secret>
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   FRONTEND_URL=http://localhost:5173
   ```

   Never commit `.env` or use example placeholder values as credentials.

4. Install dependencies and start the backend in one terminal:

   ```bash
   cd server
   npm install
   npm run dev
   ```

5. Install dependencies and start the frontend in a second terminal:

   ```bash
   cd client
   npm install
   npm run dev
   ```

6. Open the local URL shown in the frontend terminal, usually `http://localhost:5173`.

## Project Goals

EthioPoultry aims to support Ethiopia's poultry and egg market by improving access to product information and helping farmers and buyers connect more easily.

## Project Status

🚧 In development. The public product catalog, seller product management, and buyer favorites use the backend API and MongoDB. Other workflows may still need production hardening and end-to-end testing.

## Author

**Megabi Getaneh**

GitHub: [@mega-gech](https://github.com/mega-gech)

## License

This project is currently developed for learning and portfolio purposes.
