import fetchMock from "fetch-mock";
import { Token } from "../models/v1";
import { RaidenClient } from "./client";

const baseUrl = "http://localhost:5001/api";
const version = "v1";
const apiUrl = `${baseUrl}/${version}/`;

describe("Deploying endpoint", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  test("Register a token", async () => {
    const tokenAddress = "0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8";
    const tokenNetworkAddress = "0xC4F8393fb7971E8B299bC1b302F85BfFB3a1275a";
    const expectedToken: Token = {
      token_network_address: tokenNetworkAddress
    };
    const expectedResponse = new Response(JSON.stringify(expectedToken), {
      status: 201,
      statusText: "Created"
    });

    fetchMock.put(apiUrl + "tokens/" + tokenAddress, expectedResponse);
    const client = new RaidenClient(baseUrl, version);

    const response = await client.registerToken(tokenAddress);

    expect(response).toBeDefined();
    expect(response.token_network_address).toBe(tokenNetworkAddress);
  });
});
