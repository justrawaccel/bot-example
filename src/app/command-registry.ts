import type { ChatInputCommandInteraction } from "discord.js";
import type { AppContext } from "./context";
import type { Command } from "./types";

export class CommandRegistry {
  private map = new Map<string, Command>();

  register(command: Command) {
    if (this.map.has(command.name)) {
      throw new Error(`Command already registered: ${command.name}`);
    }

    this.map.set(command.name, command);
  }

  list() {
    return [...this.map.values()];
  }

  async execute(i: ChatInputCommandInteraction, ctx: AppContext) {
    const cmd = this.map.get(i.commandName);
    if (!cmd) {
      await i.reply({ content: "Unknown command.", ephemeral: true });
      return;
    }

    const middlewares = cmd.middlewares ?? [];
    let index = 0;

    const next = async (): Promise<void> => {
      if (index < middlewares.length) {
        const middleware = middlewares[index++];
        await middleware(i, ctx, next);
      } else {
        await cmd.execute(i, ctx);
      }
    };

    await next();
  }
}
