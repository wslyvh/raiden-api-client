export interface Event {
  event: string;
  amount: number;
  initiator: string;
  identifier: number;
  log_time: string;
}

export type Events = ReadonlyArray<Event>;
