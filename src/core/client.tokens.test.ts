import fetchMock from "fetch-mock";
import { RaidenClient } from "./client";

const baseUrl = "http://localhost:5001/api";
const version = "v1";
const apiUrl = `${baseUrl}/${version}/`;

describe("Tokens endpoint", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  test("Get Tokens", async () => {
    fetchMock.mock(apiUrl + "tokens", ["0x01", "0x02", "0x03"]);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.getTokens();

    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(1);
  });

  test("Get Token network for token address", async () => {
    const tokenAddress = "0xb0d63aE8726c54912eFe0B812ac04eeA127845f3";
    const tokenNetwork = "0x7600600dB7a6e23BA1d3bd0edaCe035f1b544c55";
    fetchMock.mock(apiUrl + "tokens/" + tokenAddress, tokenNetwork);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.getTokenNetworkForTokenAddress(tokenAddress);

    expect(response).toBeDefined();
    expect(response).toBe(tokenNetwork);
  });

  test("Get Token network for invalid token address", async () => {
    const tokenAddress = "0x01";
    fetchMock.mock(apiUrl + "tokens/" + tokenAddress, 404);
    const client = new RaidenClient(baseUrl, version);

    await expect(client.getTokenNetworkForTokenAddress(tokenAddress)).rejects.toThrow();
  });

  test("Get Token network with empty token address", async () => {
    const tokenAddress = "";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.getTokenNetworkForTokenAddress(tokenAddress)).rejects.toThrow();
  });

  test("Get Token network that is not registered", async () => {
    const tokenAddress = "0xe925004Ae695103f5D0A2A764397b96ED3d81C7F";
    fetchMock.mock(apiUrl + "tokens/" + tokenAddress, 404);
    const client = new RaidenClient(baseUrl, version);

    await expect(client.getTokenNetworkForTokenAddress(tokenAddress)).rejects.toThrow();
  });

  test("Get Partners for token address", async () => {
    const tokenAddress = "0x01";
    fetchMock.mock(`${apiUrl}tokens/${tokenAddress}/partners`, []);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.getPartnersForTokenAddress(tokenAddress);

    expect(response).toBeDefined();
    expect(response.length).toBe(0);
  });

  test("Get Partners with empty token address", async () => {
    const tokenAddress = "";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.getTokenNetworkForTokenAddress(tokenAddress)).rejects.toThrow();
  });
});

describe("Token transfers ", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  test("Get Pending transfers", async () => {
    fetchMock.mock(apiUrl + "pending_transfers", []);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.getPendingTransfers();

    expect(response).toBeDefined();
    expect(response.length).toBe(0);
  });

  test("Get Pending transfers for token address", async () => {
    const tokenAddress = "0x01";
    fetchMock.mock(apiUrl + "pending_transfers/" + tokenAddress, []);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.getPendingTransfersForTokenAddress(tokenAddress);

    expect(response).toBeDefined();
    expect(response.length).toBe(0);
  });

  test("Get Pending transfers with empty token address", async () => {
    const tokenAddress = "";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.getPendingTransfersForTokenAddress(tokenAddress)).rejects.toThrow();
  });

  test("Get Pending transfers for token and partner", async () => {
    const tokenAddress = "0x01";
    const partnerAddress = "0x02";
    fetchMock.mock(`${apiUrl}pending_transfers/${tokenAddress}/${partnerAddress}`, []);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.getPendingTransfersForTokenAddressAndPartner(tokenAddress, partnerAddress);

    expect(response).toBeDefined();
    expect(response.length).toBe(0);
  });

  test("Get Pending transfers for token and partner with empty token address", async () => {
    const tokenAddress = "";
    const partnerAddress = "0x02";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.getPendingTransfersForTokenAddressAndPartner(tokenAddress, partnerAddress)).rejects.toThrow();
  });

  test("Get Pending transfers for token and partner with empty partner address", async () => {
    const tokenAddress = "0x01";
    const partnerAddress = "";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.getPendingTransfersForTokenAddressAndPartner(tokenAddress, partnerAddress)).rejects.toThrow();
  });
});
