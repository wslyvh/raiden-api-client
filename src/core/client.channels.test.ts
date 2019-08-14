import fetchMock from "fetch-mock";
import { RaidenClient } from "./client";

const baseUrl = "http://localhost:5001/api";
const version = "v1";
const apiUrl = `${baseUrl}/${version}/`;

describe("Channels endpoint", () => {
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

  test("Get Channels for token address and partner address", async () => {
    const tokenAddress = "0x01";
    const partnerAddress = "0x02";
    fetchMock.mock(apiUrl + "channels/" + tokenAddress + "/" + partnerAddress, []);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.getChannelsForTokenAddressAndPartnerAddress(tokenAddress, partnerAddress);

    expect(response).toBeDefined();
    expect(response.length).toBe(0);
  });
});
