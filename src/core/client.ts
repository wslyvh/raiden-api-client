// tslint:disable-next-line: no-var-requires
require("isomorphic-fetch"); /* global fetch */
import { Address, Channels, Partners, Token, Tokens, Transfers } from "../models/v1";

// [x] Node information
// [x] Deploying
// [ ] Channels
//    [ ] Channel Management
// [ ] Tokens
//    [ ] Transfers
// [ ] Connection Management
// [ ] Payments
// [ ] Querying
// [ ] Testing / Mint

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

  public async getPendingTransfersForTokenAddressAndChannel(tokenAddress: string, partnerAddress: string): Promise<Partners> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }
    if (!partnerAddress) {
      throw new Error(`partnerAddress is required`);
    }

    return this.call<Partners>(`${this.apiUrl}/pending_transfers/${tokenAddress}/${partnerAddress}`);
  }

  // Private
  private async call<T>(uri: string, method: string = "GET", statusCode: number = 200): Promise<T> {
    const response = await fetch(uri, {
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
