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

  test("Get Channels for token and partner", async () => {
    const tokenAddress = "0x01";
    const partnerAddress = "0x02";
    fetchMock.mock(apiUrl + "channels/" + tokenAddress + "/" + partnerAddress, []);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.getChannelsForTokenAddressAndPartnerAddress(tokenAddress, partnerAddress);

    expect(response).toBeDefined();
    expect(response.length).toBe(0);
  });

  test("Get Channels for token and partner with empty token address", async () => {
    const tokenAddress = "";
    const partnerAddress = "0x02";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.getChannelsForTokenAddressAndPartnerAddress(tokenAddress, partnerAddress)).rejects.toThrow();
  });

  test("Get Channels for token and partner with empty partner address", async () => {
    const tokenAddress = "0x01";
    const partnerAddress = "";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.getChannelsForTokenAddressAndPartnerAddress(tokenAddress, partnerAddress)).rejects.toThrow();
  });
});

describe("Channels management", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  test("Open a new channel", async () => {
    const partnerAddress = "0x01";
    const tokenAddress = "0x02";
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

  test("Open a new channel with empty partner address", async () => {
    const partnerAddress = "";
    const tokenAddress = "0x02";
    const totalDeposit = 100;
    const settleTimeout = 200;
    const client = new RaidenClient(baseUrl, version);

    await expect(client.createChannel(tokenAddress, partnerAddress, totalDeposit, settleTimeout)).rejects.toThrow();
  });

  test("Open a new channel with empty token address", async () => {
    const partnerAddress = "0x01";
    const tokenAddress = "";
    const totalDeposit = 100;
    const settleTimeout = 200;
    const client = new RaidenClient(baseUrl, version);

    await expect(client.createChannel(tokenAddress, partnerAddress, totalDeposit, settleTimeout)).rejects.toThrow();
  });

  test("Open a new channel with no total deposit", async () => {
    const partnerAddress = "0x01";
    const tokenAddress = "0x02";
    const totalDeposit = 0;
    const settleTimeout = 200;
    const client = new RaidenClient(baseUrl, version);

    await expect(client.createChannel(tokenAddress, partnerAddress, totalDeposit, settleTimeout)).rejects.toThrow();
  });

  test("Open a new channel with no settle timeout", async () => {
    const partnerAddress = "0x01";
    const tokenAddress = "0x02";
    const totalDeposit = 100;
    const settleTimeout = 0;
    const client = new RaidenClient(baseUrl, version);

    await expect(client.createChannel(tokenAddress, partnerAddress, totalDeposit, settleTimeout)).rejects.toThrow();
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

  test("Close a channel with empty token address", async () => {
    const tokenAddress = "";
    const partnerAddress = "0x02";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.closeChannel(tokenAddress, partnerAddress)).rejects.toThrow();
  });

  test("Close a channel with empty partner address", async () => {
    const tokenAddress = "0x01";
    const partnerAddress = "";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.closeChannel(tokenAddress, partnerAddress)).rejects.toThrow();
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

  test("Increase the deposit in a channel with empty token address", async () => {
    const tokenAddress = "";
    const partnerAddress = "0x02";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.depositChannel(tokenAddress, partnerAddress)).rejects.toThrow();
  });

  test("Increase the deposit in a channel with empty partner address", async () => {
    const tokenAddress = "0x01";
    const partnerAddress = "";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.depositChannel(tokenAddress, partnerAddress)).rejects.toThrow();
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

  test("Withdraw tokens from a channel with empty token address", async () => {
    const tokenAddress = "";
    const partnerAddress = "0x02";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.withdrawChannel(tokenAddress, partnerAddress)).rejects.toThrow();
  });

  test("Withdraw tokens from a channel with emmpty partner address", async () => {
    const tokenAddress = "0x01";
    const partnerAddress = "";
    const client = new RaidenClient(baseUrl, version);

    await expect(client.withdrawChannel(tokenAddress, partnerAddress)).rejects.toThrow();
  });
});
