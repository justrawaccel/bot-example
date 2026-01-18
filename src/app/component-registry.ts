import type {
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuInteraction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
} from "discord.js";
import type { AppContext } from "./context";
import type { ComponentHandler } from "./types";

type AnyComponentInteraction =
  | ButtonInteraction
  | StringSelectMenuInteraction
  | UserSelectMenuInteraction
  | RoleSelectMenuInteraction
  | ChannelSelectMenuInteraction
  | MentionableSelectMenuInteraction
  | ModalSubmitInteraction;

export class ComponentRegistry {
  private handlers: ComponentHandler[] = [];

  register(handler: ComponentHandler) {
    this.handlers.push(handler);
  }

  registerMany(handlers: ComponentHandler[]) {
    this.handlers.push(...handlers);
  }

  async execute(i: AnyComponentInteraction, ctx: AppContext) {
    for (const { customId, handler } of this.handlers) {
      if (this.matches(customId, i.customId)) {
        await handler(i as any, ctx);
        return true;
      }
    }

    return false;
  }

  private matches(pattern: string | RegExp, customId: string): boolean {
    if (typeof pattern === "string") {
      return pattern === customId;
    }

    return pattern.test(customId);
  }

  list() {
    return [...this.handlers];
  }
}
