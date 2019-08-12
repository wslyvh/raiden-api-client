import fetchMock from "fetch-mock";
import { RaidenClient } from "./client";

const baseUrl = "http://localhost:5001/api";
const version = "v1";
const apiUrl = `${baseUrl}/${version}/`;

describe("Core Client API", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  test("Client initialization", async () => {
    const client = new RaidenClient(baseUrl, version);

    expect(client).toBeInstanceOf(RaidenClient);
  });

  test("Client initialization with empty baseUrl", async () => {
    expect(() => new RaidenClient("")).toThrowError("baseUrl is required");
  });

  test("Client initialization with empty version", async () => {
    expect(() => new RaidenClient(baseUrl, "")).toThrowError("version is required");
  });

  test("Invalid API endpoint", async () => {
    const invalidVersion = "invalidVersion1230";
    fetchMock.mock(`${baseUrl}/${invalidVersion}/address`, 404);
    const client = new RaidenClient(baseUrl, invalidVersion);

    await expect(client.getClientAddress()).rejects.toThrow("invalid response: 404");
  });
});

describe("Client Address", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  test("Invalid response", async () => {
    fetchMock.mock(apiUrl + "address", 200);
    const client = new RaidenClient(baseUrl, version);

    await expect(client.getClientAddress()).rejects.toThrow();
  });

  test("Get Client Address", async () => {
    fetchMock.mock(apiUrl + "address", { our_address: "0x123" });
    const client = new RaidenClient(baseUrl, version);

    const response = await client.getClientAddress();

    expect(response).toBeDefined();
    expect(response.our_address).toBeDefined();
  });
});

describe("Channels", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  test("Get Channels", async () => {
    fetchMock.mock(apiUrl + "channels", []);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.getChannels();

    expect(response).toBeDefined();
    expect(response.length).toBe(0);
  });

  test("Get Channels for token address", async () => {
    const tokenAddress = "0x01";
    fetchMock.mock(apiUrl + "channels/" + tokenAddress, []);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.getChannelsForTokenAddress(tokenAddress);

    expect(response).toBeDefined();
    expect(response.length).toBe(0);
  });

  test("Get Channels with empty token address", async () => {
    const tokenAddress = "";
    fetchMock.mock(apiUrl + "channels/", []);
    const client = new RaidenClient(baseUrl, version);

    await expect(client.getChannelsForTokenAddress(tokenAddress)).rejects.toThrow();
  });
});

describe("Tokens", () => {
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

    // TODO: Should throw with error; invalid endpoint, Not a valid EIP55 encoded address.
    await expect(client.getTokenNetworkForTokenAddress(tokenAddress)).rejects.toThrow();
  });

  test("Get Token network with empty token address", async () => {
    const tokenAddress = "";
    fetchMock.mock(apiUrl + "tokens/", []);
    const client = new RaidenClient(baseUrl, version);

    await expect(client.getTokenNetworkForTokenAddress(tokenAddress)).rejects.toThrow();
  });

  test("Get Token network that is not registered", async () => {
    const tokenAddress = "0xe925004Ae695103f5D0A2A764397b96ED3d81C7F";
    fetchMock.mock(apiUrl + "tokens/" + tokenAddress, 404);
    const client = new RaidenClient(baseUrl, version);

    // TODO: Should throw with error; No token network registered for token
    await expect(client.getTokenNetworkForTokenAddress(tokenAddress)).rejects.toThrow();
  });
});
