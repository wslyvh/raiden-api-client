export interface Payment {
  initiator_address: string;
  target_address: string;
  token_address: string;
  amount: number;
  identifier: number;
}

export type Payments = ReadonlyArray<Payment>;
