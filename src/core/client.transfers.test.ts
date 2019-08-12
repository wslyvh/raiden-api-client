import fetchMock from "fetch-mock";
import { RaidenClient } from "./client";

const baseUrl = "http://localhost:5001/api";
const version = "v1";
const apiUrl = `${baseUrl}/${version}/`;

describe("Transfers Client API", () => {
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
    fetchMock.mock(apiUrl + "pending_transfers/", []);
    const client = new RaidenClient(baseUrl, version);

    await expect(client.getPendingTransfersForTokenAddress(tokenAddress)).rejects.toThrow();
  });

  // get Pending transfers for token and partner

  test("Get Pending transfers with empty token address and partner address", async () => {
    const tokenAddress = "0x01";
    const partnerAddress = "";
    fetchMock.mock(apiUrl + "pending_transfers/" + tokenAddress + "/", []);
    const client = new RaidenClient(baseUrl, version);

    await expect(client.getPendingTransfersForTokenAddressAndChannel(tokenAddress, partnerAddress)).rejects.toThrow();
  });

  // test("Get Token network for invalid token address", async () => {
  //   const tokenAddress = "0x01";
  //   fetchMock.mock(apiUrl + "tokens/" + tokenAddress, 404);
  //   const client = new RaidenClient(baseUrl, version);

  //   // TODO: Should throw with error; invalid endpoint, Not a valid EIP55 encoded address.
  //   await expect(client.getTokenNetworkForTokenAddress(tokenAddress)).rejects.toThrow();
  // });

  // test("Get Token network with empty token address", async () => {
  //   const tokenAddress = "";
  //   fetchMock.mock(apiUrl + "tokens/", []);
  //   const client = new RaidenClient(baseUrl, version);

  //   await expect(client.getTokenNetworkForTokenAddress(tokenAddress)).rejects.toThrow();
  // });

  // test("Get Token network that is not registered", async () => {
  //   const tokenAddress = "0xe925004Ae695103f5D0A2A764397b96ED3d81C7F";
  //   fetchMock.mock(apiUrl + "tokens/" + tokenAddress, 404);
  //   const client = new RaidenClient(baseUrl, version);

  //   // TODO: Should throw with error; No token network registered for token
  //   await expect(client.getTokenNetworkForTokenAddress(tokenAddress)).rejects.toThrow();
  // });
});
