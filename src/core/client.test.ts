import fetchMock from "fetch-mock";
import { RaidenClient } from "./client";

const baseUrl = "http://localhost:5001/api";
const version = "v1";
const apiUrl = `${baseUrl}/${version}/`;

describe("testing api", () => {
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

  test("Get Tokens", async () => {
    fetchMock.mock(apiUrl + "tokens", ["0x01", "0x02", "0x03"]);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.getTokens();

    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(1);
  });
});
