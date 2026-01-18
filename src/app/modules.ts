import type { Client } from "discord.js";
import type { AppContext } from "./context";
import type { Module } from "./types";

import { createStaffModule } from "../modules/staff/staff.module";
import { exampleModule } from "../modules/example/example.module";

export const buildModules = (): Module[] => [
  createStaffModule(),
  exampleModule,
];

export const initModules = async (
  ctx: AppContext,
  client: Client,
  modules: Module[],
) => {
  for (const m of modules) {
    await m.init?.(ctx, client);
  }
};

export const disposeModules = async (modules: Module[]) => {
  for (const m of modules) {
    await m.dispose?.();
  }
};
