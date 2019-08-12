export interface Transfer {
  channel_identifier: number;
  initiator: string;
  locked_amount: number;
  payment_identifier: number;
  role: string; // “initiator”, “mediator” and “target”
  target: string;
  token_address: string;
  token_network_address: string;
  transferred_amount: number;
}

export type Transfers = ReadonlyArray<Transfer>;
