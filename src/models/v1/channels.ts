export interface Channel {
  token_network_address: string;
  channel_identifier: number;
  partner_address: string;
  token_address: string;
  balance: number;
  total_deposit: number;
  total_withdraw: number;
  state: string;
  settle_timeout: number;
  reveal_timeout: number;
}

export type Channels = ReadonlyArray<Channel>;
