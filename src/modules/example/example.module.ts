import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Events,
  ModalBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
  UserSelectMenuBuilder,
  RoleSelectMenuBuilder,
  ChannelSelectMenuBuilder,
} from "discord.js";
import type { Module } from "../../app/types";

export const exampleModule: Module = {
  name: "example",

  commands: [
    {
      name: "demo",
      description: "Demonstrates buttons, selects, and modals",
      build: () =>
        new SlashCommandBuilder()
          .setName("demo")
          .setDescription("Demonstrates buttons, selects, and modals"),
      async execute(interaction, ctx) {
        const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("example:btn:primary")
            .setLabel("Primary Button")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("example:btn:danger")
            .setLabel("Danger Button")
            .setStyle(ButtonStyle.Danger),
        );

        const row2 =
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId("example:select:options")
              .setPlaceholder("Choose an option")
              .addOptions(
                { label: "Option 1", value: "opt1", emoji: "1️⃣" },
                { label: "Option 2", value: "opt2", emoji: "2️⃣" },
                { label: "Option 3", value: "opt3", emoji: "3️⃣" },
              ),
          );

        await interaction.reply({
          content: "Here are some interactive components:",
          components: [row1, row2],
          ephemeral: true,
        });
      },
    },
    {
      name: "select-demo",
      description: "Demonstrates user, role, and channel selects",
      build: () =>
        new SlashCommandBuilder()
          .setName("select-demo")
          .setDescription("Demonstrates user, role, and channel selects"),
      async execute(interaction, ctx) {
        const row1 =
          new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
            new UserSelectMenuBuilder()
              .setCustomId("example:select:user")
              .setPlaceholder("Select a user")
              .setMinValues(1)
              .setMaxValues(1),
          );

        const row2 =
          new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
            new RoleSelectMenuBuilder()
              .setCustomId("example:select:role")
              .setPlaceholder("Select a role")
              .setMinValues(1)
              .setMaxValues(3),
          );

        const row3 =
          new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
            new ChannelSelectMenuBuilder()
              .setCustomId("example:select:channel")
              .setPlaceholder("Select a channel")
              .setChannelTypes(ChannelType.GuildText, ChannelType.GuildVoice)
              .setMinValues(1)
              .setMaxValues(1),
          );

        await interaction.reply({
          content: "Select users, roles, or channels:",
          components: [row1, row2, row3],
          ephemeral: true,
        });
      },
    },
    {
      name: "search",
      description: "Command with autocomplete",
      build: () =>
        new SlashCommandBuilder()
          .setName("search")
          .setDescription("Command with autocomplete")
          .addStringOption((opt) =>
            opt
              .setName("query")
              .setDescription("Search query")
              .setRequired(true)
              .setAutocomplete(true),
          ),
      async execute(interaction, ctx) {
        const query = interaction.options.getString("query", true);
        await interaction.reply({
          content: `You searched for: **${query}**`,
          ephemeral: true,
        });
      },
    },
  ],

  buttons: [
    {
      customId: "example:btn:primary",
      async handler(interaction, ctx) {
        await interaction.reply({
          content: "You clicked the primary button!",
          ephemeral: true,
        });
      },
    },
    {
      customId: "example:btn:danger",
      async handler(interaction, ctx) {
        const modal = new ModalBuilder()
          .setCustomId("example:modal:feedback")
          .setTitle("Feedback Form");

        const input = new TextInputBuilder()
          .setCustomId("example:modal:feedback:text")
          .setLabel("What's your feedback?")
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder("Enter your feedback here...")
          .setRequired(true)
          .setMinLength(10)
          .setMaxLength(500);

        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
          input,
        );

        modal.addComponents(row);

        await interaction.showModal(modal);
      },
    },
    {
      customId: /^example:dynamic:(.+)$/,
      async handler(interaction, ctx) {
        const match = interaction.customId.match(/^example:dynamic:(.+)$/);
        const dynamicPart = match?.[1] || "unknown";

        await interaction.reply({
          content: `Dynamic button clicked with ID: **${dynamicPart}**`,
          ephemeral: true,
        });
      },
    },
  ],

  stringSelects: [
    {
      customId: "example:select:options",
      async handler(interaction, ctx) {
        const selected = interaction.values[0];
        await interaction.reply({
          content: `You selected: **${selected}**`,
          ephemeral: true,
        });
      },
    },
  ],

  userSelects: [
    {
      customId: "example:select:user",
      async handler(interaction, ctx) {
        const users = interaction.users.map((u) => u.tag).join(", ");
        await interaction.reply({
          content: `Selected users: **${users}**`,
          ephemeral: true,
        });
      },
    },
  ],

  roleSelects: [
    {
      customId: "example:select:role",
      async handler(interaction, ctx) {
        const roles = interaction.roles.map((r) => r.name).join(", ");
        await interaction.reply({
          content: `Selected roles: **${roles}**`,
          ephemeral: true,
        });
      },
    },
  ],

  channelSelects: [
    {
      customId: "example:select:channel",
      async handler(interaction, ctx) {
        const channels = interaction.channels
          .map((c) => ("name" in c ? c.name : c.id))
          .join(", ");
        await interaction.reply({
          content: `Selected channels: **${channels}**`,
          ephemeral: true,
        });
      },
    },
  ],

  modals: [
    {
      customId: "example:modal:feedback",
      async handler(interaction, ctx) {
        const feedback = interaction.fields.getTextInputValue(
          "example:modal:feedback:text",
        );

        ctx.logger.info(
          { feedback, user: interaction.user.tag },
          "feedback received",
        );

        await interaction.reply({
          content: "Thank you for your feedback!",
          ephemeral: true,
        });
      },
    },
  ],

  autocomplete: [
    {
      commandName: "search",
      async handler(interaction, ctx) {
        const focusedValue = interaction.options.getFocused();

        const choices = [
          "JavaScript",
          "TypeScript",
          "Python",
          "Rust",
          "Go",
          "Java",
          "C++",
          "Ruby",
        ];

        const filtered = choices
          .filter((choice) =>
            choice.toLowerCase().includes(focusedValue.toLowerCase()),
          )
          .slice(0, 25);

        await interaction.respond(
          filtered.map((choice) => ({ name: choice, value: choice })),
        );
      },
    },
  ],

  events: [
    {
      event: Events.GuildMemberAdd,
      async handler(ctx, member) {
        ctx.logger.info(
          { user: member.user.tag, guild: member.guild.name },
          "member joined",
        );

        // example: send welcome message
        // const channel = member.guild.channels.cache.get(ctx.guildConfig.welcomeChannelId);
        // if (channel?.isTextBased()) {
        //   await channel.send(`Welcome ${member.user.toString()}!`);
        // }
      },
    },
    {
      event: Events.MessageCreate,
      async handler(ctx, message) {
        if (message.author.bot) return;

        if (message.content.includes("ping")) {
          ctx.logger.debug(
            { author: message.author.tag, content: message.content },
            "ping message detected",
          );
        }
      },
    },
    {
      event: Events.InteractionCreate,
      async handler(ctx, interaction) {
        ctx.logger.debug(
          {
            type: interaction.type,
            user: interaction.user.tag,
            guild: interaction.guildId,
          },
          "interaction received",
        );
      },
    },
  ],

  async init(ctx, client) {
    ctx.logger.info("example module initialized");
  },
};
