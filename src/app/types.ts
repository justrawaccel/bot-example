import type { ChatInputCommandInteraction, Client } from "discord.js";
import type { AppContext } from "./context";

export type CommandExecute = (
  i: ChatInputCommandInteraction,
  ctx: AppContext,
) => Promise<void>;

export type CommandMiddleware = (
  i: ChatInputCommandInteraction,
  ctx: AppContext,
  next: () => Promise<void>,
) => Promise<void>;

export interface Command {
  name: string;
  description: string;
  middlewares?: CommandMiddleware[];
  build: () => any;
  execute: CommandExecute;
}

export interface Module {
  name: string;
  commands?: Command[];
  init?: (ctx: AppContext, client: Client) => Promise<void>;
  dispose?: () => Promise<void>;
}
