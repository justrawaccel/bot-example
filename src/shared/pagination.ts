import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
} from "discord.js";

export class Paginator {
  constructor(
    private items: any[],
    private pageSize: number = 10,
  ) {}

  async paginate(
    i: ChatInputCommandInteraction,
    formatPage: (items: any[], page: number, total: number) => string,
  ) {
    let page = 0;
    const totalPages = Math.ceil(this.items.length / this.pageSize);

    const getPage = () => {
      const start = page * this.pageSize;
      const end = start + this.pageSize;
      return this.items.slice(start, end);
    };

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("prev")
        .setLabel("Previous")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === 0),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("Next")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === totalPages - 1),
    );

    const response = await i.reply({
      content: formatPage(getPage(), page + 1, totalPages),
      components: [row],
      ephemeral: true,
    });

    const collector = response.createMessageComponentCollector({
      time: 60000,
    });

    collector.on("collect", async (buttonI) => {
      if (buttonI.customId === "prev") page--;
      if (buttonI.customId === "next") page++;

      await buttonI.update({
        content: formatPage(getPage(), page + 1, totalPages),
        components: [row],
      });
    });
  }
}
