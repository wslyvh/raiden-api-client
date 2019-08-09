// tslint:disable-next-line: no-var-requires
require("isomorphic-fetch"); /* global fetch */
import { Address } from "../models/v1/address";
import { Channels } from "../models/v1/channel";
import { Tokens } from "../models/v1/tokens";

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

  public async getClientAddress(): Promise<Address> {
    return this.get<Address>(this.apiUrl + "address");
  }

  public async getTokens(): Promise<Tokens> {
    return this.get<Tokens>(this.apiUrl + "tokens");
  }

  public async getChannels(): Promise<Channels> {
    return this.get<Channels>(this.apiUrl + "channels");
  }

  private async get<T>(uri: string): Promise<T> {
    const response = await fetch(uri);

    if (response.status !== 200) {
      // console.log(`Error ${response.status} - ${response.statusText}`);
      throw new Error(`invalid response: ${response.status}`);
    }

    try {
      // console.log(response);
      return (await response.json()) as T;
    } catch (err) {
      throw new Error(`failed to read response: ${err.message}`);
    }
  }
}
