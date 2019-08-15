import fetchMock from "fetch-mock";
import { RaidenClient } from "./client";

const baseUrl = "http://localhost:5001/api";
const version = "v1";
const apiUrl = `${baseUrl}/${version}/`;

describe("Client information", () => {
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
