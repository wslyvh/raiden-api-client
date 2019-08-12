// tslint:disable-next-line: no-var-requires
require("isomorphic-fetch"); /* global fetch */
import { Address, Channels, Partners, Tokens, Transfers } from "../models/v1";

export class RaidenClient {
  private apiUrl: string;

  public constructor(baseUrl: string, version: string = "v1") {
    if (!baseUrl) {
      throw new Error(`baseUrl is required`);
    }
    if (!version) {
      throw new Error(`version is required`);
    }

    this.apiUrl = `${baseUrl}/${version}/`;
  }

  // Client Address
  public async getClientAddress(): Promise<Address> {
    return this.get<Address>(this.apiUrl + "address");
  }

  // Channels
  public async getChannels(): Promise<Channels> {
    return this.get<Channels>(this.apiUrl + "channels");
  }

  public async getChannelsForTokenAddress(tokenAddress: string): Promise<Channels> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }

    return this.get<Channels>(this.apiUrl + "channels/" + tokenAddress);
  }

  // Tokens
  public async getTokens(): Promise<Tokens> {
    return this.get<Tokens>(this.apiUrl + "tokens");
  }

  public async getTokenNetworkForTokenAddress(tokenAddress: string): Promise<string> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }

    return this.get<string>(this.apiUrl + "tokens/" + tokenAddress);
  }

  public async getPartnersForTokenAddress(tokenAddress: string): Promise<Partners> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }

    return this.get<Partners>(`${this.apiUrl}tokens/${tokenAddress}/partners`);
  }

  // Transfers
  public async getPendingTransfers(): Promise<Transfers> {
    return this.get<Transfers>(this.apiUrl + "pending_transfers");
  }

  public async getPendingTransfersForTokenAddress(tokenAddress: string): Promise<Partners> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }

    return this.get<Partners>(`${this.apiUrl}pending_transfers/${tokenAddress}`);
  }

  public async getPendingTransfersForTokenAddressAndChannel(tokenAddress: string, partnerAddress: string): Promise<Partners> {
    if (!tokenAddress) {
      throw new Error(`tokenAddress is required`);
    }
    if (!partnerAddress) {
      throw new Error(`partnerAddress is required`);
    }

    return this.get<Partners>(`${this.apiUrl}pending_transfers/${tokenAddress}/${partnerAddress}`);
  }

  // Private
  private async get<T>(uri: string): Promise<T> {
    const response = await fetch(uri);

    if (response.status !== 200) {
      // console.log(`Error ${response.status} - ${response.statusText} | ${uri}`);
      throw new Error(`invalid response: ${response.status}`);
    }

    try {
      return (await response
        .clone()
        .json()
        .catch(() => response.text())) as T;
    } catch (err) {
      throw new Error(`failed to read response: ${err.message}`);
    }
  }
}
