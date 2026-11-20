import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { NextFunction, Request, Response } from "express";
import { requireAdmin } from "./authMiddleware.js";

function createResponse() {
  const state: { statusCode: number; body: unknown } = {
    statusCode: 200,
    body: undefined,
  };
  const response = {
    status(code: number) {
      state.statusCode = code;
      return this;
    },
    json(body: unknown) {
      state.body = body;
      return this;
    },
  };
  return { response: response as unknown as Response, state };
}

describe("requireAdmin", () => {
  it("rejects requests without an authenticated user", () => {
    const { response, state } = createResponse();
    let passed = false;

    requireAdmin(
      { user: undefined } as Request,
      response,
      (() => {
        passed = true;
      }) as NextFunction
    );

    assert.equal(state.statusCode, 401);
    assert.equal(passed, false);
  });

  it("rejects authenticated buyers and sellers", () => {
    for (const role of ["buyer", "seller"] as const) {
      const { response, state } = createResponse();
      let passed = false;

      requireAdmin(
        { user: { userId: "user-id", role } } as Request,
        response,
        (() => {
          passed = true;
        }) as NextFunction
      );

      assert.equal(state.statusCode, 403);
      assert.equal(passed, false);
    }
  });

  it("allows authenticated administrators", () => {
    const { response, state } = createResponse();
    let passed = false;

    requireAdmin(
      { user: { userId: "admin-id", role: "admin" } } as Request,
      response,
      (() => {
        passed = true;
      }) as NextFunction
    );

    assert.equal(state.statusCode, 200);
    assert.equal(passed, true);
  });
});
