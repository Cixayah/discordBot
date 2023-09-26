const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

// inside a command, event listener, etc.
const exampleEmbed = new EmbedBuilder()
    .setColor("Blue")
    .setTitle("Dicas CSS")
    .setURL('https://github.com/cixayah')

    .addFields(
        { name: 'justify-content:', value: ' ', inline: false }, 
        { name: '\u200B', value: '\u200B' }, //Quebra de linha
        { name: 'flex-start:', value: 'alinham no lado esquerdo do contêiner.', inline: true },
        { name: 'flex-end: ', value: 'alinham no lado direito do contêiner.', inline: true },
        { name: 'center: ', value: 'alinham no centro do contêiner.', inline: true },
        { name: 'space-between: ', value: 'espaçamento igual entre eles.', inline: true },
        { name: 'space-around: ', value: 'espaçamento igual ao redor deles.', inline: true },

        { name: '\u200B', value: '\u200B' },
        { name: ' align-items: & align-self:', value: ' ', inline: false },
        { name: '\u200B', value: '\u200B' },
        { name: 'flex-start:', value: 'se alinham na parte superior do contêiner.', inline: true },
        { name: 'flex-end', value: 'se alinham na parte inferior do contêiner.', inline: true },
        { name: 'center:', value: 'se alinham no centro vertical do contêiner.', inline: true },
        { name: 'baseline:', value: 'os itens são exibidos na linha de base do contêiner.', inline: true },
        { name: 'stretch', value: 'os itens são esticados para caber no contêiner.', inline: true },
    );


module.exports = {
    data: new SlashCommandBuilder()
        .setName("css")
        .setDescription("Relembrar comandos do CSS"),

    async execute(interaction) {
        await interaction.reply({ embeds: [exampleEmbed] })
    }
}