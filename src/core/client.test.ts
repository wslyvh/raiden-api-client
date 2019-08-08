import { RaidenClient } from "./client";

const baseUrl = "http://localhost:5001/api";
const version = "v1";

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
  const client = new RaidenClient(baseUrl, "invalidVersion123");

  await expect(client.getClientAddress()).rejects.toThrow("invalid response: 404");
});

test("Get Client Address", async () => {
  const client = new RaidenClient(baseUrl, version);

  const response = await client.getClientAddress();

  expect(response).toBeDefined();
  expect(response.our_address).toBeDefined();
});

test("Get Tokens", async () => {
  const client = new RaidenClient(baseUrl, version);

  const response = await client.getTokens();

  expect(response).toBeDefined();
  expect(response.length).toBeGreaterThan(1);
});
