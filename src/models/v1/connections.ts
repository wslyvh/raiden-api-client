export interface Connection {
  funds: number;
  sum_deposits: number;
  channels: number;
}

export type Connections = ReadonlyArray<Connection>;
