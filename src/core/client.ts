// tslint:disable-next-line: no-var-requires
require("isomorphic-fetch"); /* global fetch */
import { Address, Channel, Channels, Events, Partners, Payment, Token, Tokens, Transfers } from "../models/v1";

// [x] Node information
// [x] Deploying
// [x] Channels
//    [x] Channel Management
// [x] Tokens
//    [x] Transfers
// [ ] Connection Management
// [x] Payments
// [x] Querying

export class RaidenClient {
  private apiUrl: string;

  public constructor(baseUrl: string, version: string = "v1") {
    if (!baseUrl) {
      throw new Error(`baseUrl is required`);
    }
    if (!version) {
      throw new Error(`version is required`);
    }

    this.apiUrl = `${baseUrl}/${version}`;
  }

  // Node Information
  public async getClientAddress(): Promise<Address> {
    return this.call<Address>(`${this.apiUrl}/address`);
  }

  // Deploying
  public async registerToken(tokenAddress: string): Promise<Token> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }

    return this.call<Token>(`${this.apiUrl}/tokens/${tokenAddress}`, "PUT", 201);
  }

  // Channels
  public async getChannels(): Promise<Channels> {
    return this.call<Channels>(`${this.apiUrl}/channels`);
  }

  public async getChannelsForTokenAddress(tokenAddress: string): Promise<Channels> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }

    return this.call<Channels>(`${this.apiUrl}/channels/${tokenAddress}`);
  }

  public async getChannelsForTokenAddressAndPartnerAddress(tokenAddress: string, partnerAddress: string): Promise<Channels> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }
    if (!partnerAddress) {
      throw new Error(`partnerAddress is required`);
    }

    return this.call<Channels>(`${this.apiUrl}/channels/${tokenAddress}/${partnerAddress}`);
  }

  // Channel Management
  public async createChannel(partnerAddress: string, tokenAddress: string, totalDeposit: number, settleTimeout: number): Promise<Channel> {
    if (!partnerAddress) {
      throw new Error(`partnerAddress is required`);
    }
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }
    if (totalDeposit <= 0) {
      throw new Error(`totalDeposit is required`);
    }
    if (settleTimeout <= 0) {
      throw new Error(`settleTimeout is required`);
    }
    const body = { partner_address: partnerAddress, token_address: tokenAddress, total_deposit: totalDeposit, settle_timeout: settleTimeout };

    return this.call<Channel>(`${this.apiUrl}/channels`, "PUT", 201, body);
  }

  public async closeChannel(tokenAddress: string, partnerAddress: string): Promise<Channel> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }
    if (!partnerAddress) {
      throw new Error(`partnerAddress is required`);
    }

    const body = { state: "closed" };

    return this.call<Channel>(`${this.apiUrl}/channels/${tokenAddress}/${partnerAddress}`, "PATCH", 200, body);
  }

  public async depositChannel(tokenAddress: string, partnerAddress: string): Promise<Channel> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }
    if (!partnerAddress) {
      throw new Error(`partnerAddress is required`);
    }

    const body = { total_deposit: 100 };

    return this.call<Channel>(`${this.apiUrl}/channels/${tokenAddress}/${partnerAddress}`, "PATCH", 200, body);
  }

  public async withdrawChannel(tokenAddress: string, partnerAddress: string): Promise<Channel> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }
    if (!partnerAddress) {
      throw new Error(`partnerAddress is required`);
    }

    const body = { total_withdraw: 100 };

    return this.call<Channel>(`${this.apiUrl}/channels/${tokenAddress}/${partnerAddress}`, "PATCH", 200, body);
  }

  // Tokens
  public async getTokens(): Promise<Tokens> {
    return this.call<Tokens>(`${this.apiUrl}/tokens`);
  }

  public async getTokenNetworkForTokenAddress(tokenAddress: string): Promise<string> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }

    return this.call<string>(`${this.apiUrl}/tokens/${tokenAddress}`);
  }

  public async getPartnersForTokenAddress(tokenAddress: string): Promise<Partners> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }

    return this.call<Partners>(`${this.apiUrl}/tokens/${tokenAddress}/partners`);
  }

  // Transfers
  public async getPendingTransfers(): Promise<Transfers> {
    return this.call<Transfers>(`${this.apiUrl}/pending_transfers`);
  }

  public async getPendingTransfersForTokenAddress(tokenAddress: string): Promise<Partners> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }

    return this.call<Partners>(`${this.apiUrl}/pending_transfers/${tokenAddress}`);
  }

  public async getPendingTransfersForTokenAddressAndPartner(tokenAddress: string, partnerAddress: string): Promise<Partners> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }
    if (!partnerAddress) {
      throw new Error(`partnerAddress is required`);
    }

    return this.call<Partners>(`${this.apiUrl}/pending_transfers/${tokenAddress}/${partnerAddress}`);
  }

  // Connection Management

  // Payments
  public async initiatePayment(tokenAddress: string, targetAddress: string, amount: number, identifier: number): Promise<Payment> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }
    if (!targetAddress) {
      throw new Error(`targetAddress is required`);
    }
    if (amount <= 0) {
      throw new Error(`amount is required`);
    }
    if (identifier <= 0) {
      throw new Error(`identifier is required`);
    }

    const body = { amount, identifier };

    return this.call<Payment>(`${this.apiUrl}/payments/${tokenAddress}/${targetAddress}`, "POST", 200, body);
  }

  // Querying
  public async queryEvents(tokenAddress: string, targetAddress: string): Promise<Events> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }
    if (!targetAddress) {
      throw new Error(`targetAddress is required`);
    }

    return this.call<Events>(`${this.apiUrl}/payments/${tokenAddress}/${targetAddress}`);
  }

  // Private
  private async call<T>(uri: string, method: string = "GET", statusCode: number = 200, body: any = {}): Promise<T> {
    const response = await fetch(uri, {
      body: JSON.stringify(body),
      method
    });

    if (response.status !== statusCode) {
      // console.log(`Error ${response.status} - ${response.statusText} | ${uri}`);
      throw new Error(`invalid response: ${response.status}`);
    }

    try {
      // console.log(response);
      return (await response
        .clone()
        .json()
        .catch(() => response.text())) as T;
    } catch (err) {
      throw new Error(`failed to read response: ${err.message}`);
    }
  }
}
