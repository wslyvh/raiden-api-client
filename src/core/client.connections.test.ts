import fetchMock from "fetch-mock";
import { Channel } from "../models/v1";
import { RaidenClient } from "./client";

const baseUrl = "http://localhost:5001/api";
const version = "v1";
const apiUrl = `${baseUrl}/${version}`;

describe("Connections endpoint", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  test("Get Connections", async () => {
    fetchMock.mock(`${apiUrl}/connections`, []);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.getConnections();

    expect(response).toBeDefined();
    expect(response.length).toBe(0);
  });

  test("Join a token network", async () => {
    const tokenAddress = "0x01";
    const funds = 100;
    fetchMock.put(`${apiUrl}/connections/${tokenAddress}`, 204);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.joinTokenNetwork(tokenAddress, funds);

    expect(response).toBeDefined();
  });

  test("Join a token network with initial channel target", async () => {
    const tokenAddress = "0x01";
    const funds = 100;
    const channelTarget = 3;
    fetchMock.put(`${apiUrl}/connections/${tokenAddress}`, 204);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.joinTokenNetwork(tokenAddress, funds, channelTarget);

    expect(response).toBeDefined();
  });

  test("Join a token network with joinable funds target", async () => {
    const tokenAddress = "0x01";
    const funds = 100;
    const channelTarget = 3;
    const fundTarget = 0.4;
    fetchMock.put(`${apiUrl}/connections/${tokenAddress}`, 204);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.joinTokenNetwork(tokenAddress, funds, channelTarget, fundTarget);

    expect(response).toBeDefined();
  });

  test("Join a token network with empty token address", async () => {
    const tokenAddress = "";
    const funds = 100;
    const client = new RaidenClient(baseUrl, version);

    await expect(client.joinTokenNetwork(tokenAddress, funds)).rejects.toThrow();
  });

  test("Join a token network with no funds", async () => {
    const tokenAddress = "0x01";
    const funds = 0;
    const client = new RaidenClient(baseUrl, version);

    await expect(client.joinTokenNetwork(tokenAddress, funds)).rejects.toThrow();
  });

  test("Leave a token network", async () => {
    const tokenAddress = "0x01";
    fetchMock.delete(`${apiUrl}/connections/${tokenAddress}`, []);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.leaveTokenNetwork(tokenAddress);

    expect(response).toBeDefined();
    expect(response.length).toBe(0);
  });

  test("Leave a token network with empty token address", async () => {
    const tokenAddress = "";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.leaveTokenNetwork(tokenAddress)).rejects.toThrow();
  });
});
