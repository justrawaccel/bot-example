import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";

export default defineConfig({
  clientUrl: process.env.DATABASE_URL,
  entities: ["dist/shared/db/entities/*.js"],
  entitiesTs: ["src/shared/db/entities/*.ts"],
  migrations: {
    path: "dist/shared/db/migrations",
    pathTs: "src/shared/db/migrations",
    glob: "!(*.d).{js,ts}",
  },
  extensions: [Migrator],
  debug: process.env.NODE_ENV !== "production",
});
