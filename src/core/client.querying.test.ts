import fetchMock from "fetch-mock";
import { RaidenClient } from "./client";

const baseUrl = "http://localhost:5001/api";
const version = "v1";
const apiUrl = `${baseUrl}/${version}/`;

describe("Querying endpoint", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  test("Query events", async () => {
    const tokenAddress = "0x01";
    const targetAddress = "0x02";
    fetchMock.mock(`${apiUrl}payments/${tokenAddress}/${targetAddress}`, []);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.queryEvents(tokenAddress, targetAddress);

    expect(response).toBeDefined();
    expect(response.length).toBe(0);
  });

  test("Query events with empty token address", async () => {
    const tokenAddress = "";
    const targetAddress = "0x02";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.queryEvents(tokenAddress, targetAddress)).rejects.toThrow();
  });

  test("Query events with empty target address", async () => {
    const tokenAddress = "0x01";
    const targetAddress = "";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.queryEvents(tokenAddress, targetAddress)).rejects.toThrow();
  });
});
