# Contributing

## Overview

This is a template repository for Discord bots. Contributions that improve the template's architecture, developer experience, or documentation are welcome.

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) runtime
- [Docker](https://www.docker.com/get-started) and Docker Compose
- Discord bot token and application

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd bot-example
   ```

2. Install dependencies:
   ```sh
   bun install
   ```

3. Start infrastructure services:
   ```sh
   docker compose -f docker/docker-compose.yml up -d
   ```

4. Configure environment variables in `.env`:
   ```
   DISCORD_TOKEN=your_token
   DISCORD_CLIENT_ID=your_client_id
   GUILD_ID=your_guild_id
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/discord_bot
   REDIS_URL=redis://localhost:6379
   ```

5. Run database migrations:
   ```sh
   bun run migration:up
   ```

6. Start development server:
   ```sh
   bun run dev
   ```

## Project Structure

```
src/
├── app/           # Core application layer
│   ├── config/    # Configuration loaders
│   ├── events/    # Application events
│   └── *.ts       # Core services
├── modules/       # Feature modules
└── shared/        # Shared utilities and infrastructure
```

## Development Guidelines

### Adding a Module

Modules are self-contained features with commands and event handlers. Create a new directory in `src/modules/`:

```typescript
// src/modules/example/index.ts
import type { Module } from '../../app/types';

export const exampleModule: Module = {
  name: 'example',
  commands: [
    // your commands here
  ],
  async init(ctx, client) {
    // setup logic
  },
  async dispose() {
    // cleanup logic
  },
};
```

Register the module in `src/app/modules.ts`.

### Creating Commands

Commands follow the builder pattern:

```typescript
import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../app/types';

export const exampleCommand: Command = {
  name: 'example',
  description: 'Example command',
  build: () => new SlashCommandBuilder()
    .setName('example')
    .setDescription('Example command'),
  async execute(interaction, ctx) {
    await interaction.reply('Hello!');
  },
};
```

### Database Migrations

Create a new migration:
```sh
bun run migration:create
```

Migrations are stored in `src/shared/db/migrations/`.

### Code Style

- Run ESLint: `bun run lint`
- Run Prettier: `bun run format`
- Use TypeScript strict mode
- Prefer explicit types over inference for public APIs
- Use structured logging via `ctx.logger`

## Testing

Testing infrastructure is not yet implemented. Contributions to add a testing framework are welcome.

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes following the guidelines above
4. Run linting and formatting: `bun run lint && bun run format`
5. Commit with clear, descriptive messages
6. Push to your fork and submit a pull request

### PR Guidelines

- Keep changes focused and atomic
- Update documentation for user-facing changes
- Explain the motivation and impact in the PR description
- Ensure the bot starts without errors

## Reporting Issues

When reporting bugs or requesting features:

- Check existing issues first
- Provide clear reproduction steps for bugs
- Include relevant logs, error messages, and environment details
- For feature requests, explain the use case and benefits

## Code of Conduct

Be respectful and constructive in all interactions. This is a collaborative environment focused on building quality software.

## Questions

For questions about using this template or contributing, open a discussion or issue on GitHub.
