import { Database } from "bun:sqlite";

export const db = new Database("narrows.sqlite");

export type User = {
  id: number;
  username: string;
  discord_id: string;
  created_at: string;
  session?: string;
};
