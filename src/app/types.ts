import type {
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  ClientEvents,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
  RoleSelectMenuInteraction,
  MentionableSelectMenuInteraction,
  ChannelSelectMenuInteraction,
} from "discord.js";
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

export type ButtonHandler = (
  i: ButtonInteraction,
  ctx: AppContext,
) => Promise<void>;

export type StringSelectHandler = (
  i: StringSelectMenuInteraction,
  ctx: AppContext,
) => Promise<void>;

export type UserSelectHandler = (
  i: UserSelectMenuInteraction,
  ctx: AppContext,
) => Promise<void>;

export type RoleSelectHandler = (
  i: RoleSelectMenuInteraction,
  ctx: AppContext,
) => Promise<void>;

export type ChannelSelectHandler = (
  i: ChannelSelectMenuInteraction,
  ctx: AppContext,
) => Promise<void>;

export type MentionableSelectHandler = (
  i: MentionableSelectMenuInteraction,
  ctx: AppContext,
) => Promise<void>;

export type ModalHandler = (
  i: ModalSubmitInteraction,
  ctx: AppContext,
) => Promise<void>;

export interface ComponentHandler<T = any> {
  customId: string | RegExp;
  handler: (i: T, ctx: AppContext) => Promise<void>;
}

export type AutocompleteHandler = (
  i: AutocompleteInteraction,
  ctx: AppContext,
) => Promise<void>;

export interface AutocompleteDefinition {
  commandName: string;
  handler: AutocompleteHandler;
}

export type EventHandler<K extends keyof ClientEvents> = (
  ctx: AppContext,
  ...args: ClientEvents[K]
) => Promise<void> | void;

export interface EventListener<K extends keyof ClientEvents = any> {
  event: K;
  handler: EventHandler<K>;
  once?: boolean;
}

export interface Module {
  name: string;
  commands?: Command[];
  buttons?: ComponentHandler<ButtonInteraction>[];
  stringSelects?: ComponentHandler<StringSelectMenuInteraction>[];
  userSelects?: ComponentHandler<UserSelectMenuInteraction>[];
  roleSelects?: ComponentHandler<RoleSelectMenuInteraction>[];
  channelSelects?: ComponentHandler<ChannelSelectMenuInteraction>[];
  mentionableSelects?: ComponentHandler<MentionableSelectMenuInteraction>[];
  modals?: ComponentHandler<ModalSubmitInteraction>[];
  autocomplete?: AutocompleteDefinition[];
  events?: EventListener[];
  init?: (ctx: AppContext, client: Client) => Promise<void>;
  dispose?: () => Promise<void>;
}
