import fetchMock from "fetch-mock";
import { RaidenClient } from "./client";
import { Channel } from "../models/v1";

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

describe("Channels management", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  test("Open a new channel", async () => {
    const tokenAddress = "0x01";
    const partnerAddress = "0x02";
    const totalDeposit = 100;
    const settleTimeout = 200;
    const expected: Channel = {
      token_network_address: tokenAddress,
      channel_identifier: 1,
      partner_address: partnerAddress,
      token_address: tokenAddress,
      balance: totalDeposit,
      total_deposit: totalDeposit,
      total_withdraw: 0,
      state: "opened",
      settle_timeout: settleTimeout,
      reveal_timeout: 0
    };
    const expectedResponse = new Response(JSON.stringify(expected), {
      status: 201,
      statusText: "Created"
    });

    fetchMock.put(apiUrl + "channels", expectedResponse);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.createChannel(partnerAddress, tokenAddress, totalDeposit, settleTimeout);

    expect(response).toBeDefined();
    expect(response.token_network_address).toBe(tokenAddress);
    expect(response.partner_address).toBe(partnerAddress);
    expect(response.total_deposit).toBe(totalDeposit);
    expect(response.settle_timeout).toBe(settleTimeout);
  });

  test("Open a channel with invalid body", async () => {
    // TODO
  });

  test("Close a channel", async () => {
    const tokenAddress = "0x01";
    const partnerAddress = "0x02";
    const expectedResponse = new Response(JSON.stringify({ state: "closed" }), {
      status: 200,
      statusText: "Success"
    });
    fetchMock.patch(`${apiUrl}channels/${tokenAddress}/${partnerAddress}`, expectedResponse);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.closeChannel(tokenAddress, partnerAddress);

    expect(response).toBeDefined();
    expect(response.state).toBe("closed");
  });

  test("Increase the deposit in a channel", async () => {
    const tokenAddress = "0x01";
    const partnerAddress = "0x02";
    const expectedResponse = new Response(JSON.stringify({ total_deposit: 100 }), {
      status: 200,
      statusText: "Success"
    });
    fetchMock.patch(`${apiUrl}channels/${tokenAddress}/${partnerAddress}`, expectedResponse);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.depositChannel(tokenAddress, partnerAddress);

    expect(response).toBeDefined();
    expect(response.total_deposit).toBe(100);
  });

  test("Withdraw tokens from a channel", async () => {
    const tokenAddress = "0x01";
    const partnerAddress = "0x02";
    const expectedResponse = new Response(JSON.stringify({ total_withdraw: 100 }), {
      status: 200,
      statusText: "Success"
    });
    fetchMock.patch(`${apiUrl}channels/${tokenAddress}/${partnerAddress}`, expectedResponse);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.withdrawChannel(tokenAddress, partnerAddress);

    expect(response).toBeDefined();
    expect(response.total_withdraw).toBe(100);
  });
});
