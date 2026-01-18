import type { AutocompleteInteraction } from "discord.js";
import type { AppContext } from "./context";
import type { AutocompleteDefinition } from "./types";

export class AutocompleteRegistry {
  private handlers = new Map<string, AutocompleteDefinition>();

  register(definition: AutocompleteDefinition) {
    if (this.handlers.has(definition.commandName)) {
      throw new Error(
        `Autocomplete handler already registered for command: ${definition.commandName}`,
      );
    }

    this.handlers.set(definition.commandName, definition);
  }

  registerMany(definitions: AutocompleteDefinition[]) {
    for (const def of definitions) {
      this.register(def);
    }
  }

  async execute(i: AutocompleteInteraction, ctx: AppContext) {
    const handler = this.handlers.get(i.commandName);
    if (!handler) {
      return false;
    }

    await handler.handler(i, ctx);
    return true;
  }

  list() {
    return [...this.handlers.values()];
  }
}
