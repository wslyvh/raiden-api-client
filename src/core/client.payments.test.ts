import fetchMock from "fetch-mock";
import { RaidenClient } from "./client";
import { Payment } from "../models/v1";

const baseUrl = "http://localhost:5001/api";
const version = "v1";
const apiUrl = `${baseUrl}/${version}/`;

describe("Payments endpoint", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  test("Initiate a payment", async () => {
    const tokenAddress = "0x01";
    const targetAddress = "0x02";
    const amount = 100;
    const identifier = 1;
    const expectedPayment: Payment = {
      initiator_address: "0x",
      target_address: targetAddress,
      token_address: tokenAddress,
      amount,
      identifier
    };
    const expectedResponse = new Response(JSON.stringify(expectedPayment), {
      status: 200,
      statusText: "OK"
    });

    fetchMock.mock(`${apiUrl}payments/${tokenAddress}/${targetAddress}`, expectedResponse);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.initiatePayment(tokenAddress, targetAddress, amount, identifier);

    expect(response).toBeDefined();
    expect(response.target_address).toBe(targetAddress);
    expect(response.token_address).toBe(tokenAddress);
    expect(response.amount).toBe(amount);
    expect(response.identifier).toBe(identifier);
  });

  test("Initiate a payment with empty token address", async () => {
    const tokenAddress = "";
    const targetAddress = "0x02";
    const amount = 100;
    const identifier = 1;
    const client = new RaidenClient(baseUrl, version);

    await expect(client.initiatePayment(tokenAddress, targetAddress, amount, identifier)).rejects.toThrow();
  });

  test("Initiate a payment with empty target address", async () => {
    const tokenAddress = "0x01";
    const targetAddress = "";
    const amount = 100;
    const identifier = 1;
    const client = new RaidenClient(baseUrl, version);

    await expect(client.initiatePayment(tokenAddress, targetAddress, amount, identifier)).rejects.toThrow();
  });

  test("Initiate a payment with no amount", async () => {
    const tokenAddress = "0x01";
    const targetAddress = "0x02";
    const amount = 0;
    const identifier = 1;
    const client = new RaidenClient(baseUrl, version);

    await expect(client.initiatePayment(tokenAddress, targetAddress, amount, identifier)).rejects.toThrow();
  });

  test("Initiate a payment with no identifier", async () => {
    const tokenAddress = "0x01";
    const targetAddress = "0x02";
    const amount = 100;
    const identifier = 0;
    const client = new RaidenClient(baseUrl, version);

    await expect(client.initiatePayment(tokenAddress, targetAddress, amount, identifier)).rejects.toThrow();
  });
});
