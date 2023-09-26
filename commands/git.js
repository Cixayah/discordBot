const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

// inside a command, event listener, etc.
const exampleEmbed = new EmbedBuilder()
    .setColor("Orange")
    .setTitle("Comandos do Git")
    .setURL('https://github.com/cixayah')

    .addFields(
        { name: '\u200B', value: '\u200B' }, //Quebra de linha
        { name: '$ git init', value: 'Cria um novo repositório local', inline: true },
		{ name: '$ git add .', value: 'Faz o snapshot dos arquivo na preparação para versionamento', inline: true },
        { name: '$ git commit -m "Breve Descrição"', value: 'Grava o snapshot permanentemente do arquivo no histórico de versão', inline: true },
        { name: '\u200B', value: '\u200B' },
		{ name: '$ git branch -M master', value: 'Cria uma branch master', inline: true },
		{ name: '$ git remote add origin https://github.com/USUARIO/REPOSITÓRIO.git', value: 'Define o repositório', inline: true },
		{ name: '$ git push -u origin master', value: 'Envia todos os commits do branch local para o GitHub', inline: true },
        { name: '\u200B', value: '\u200B' },
		{ name: '$ git clone [url]', value: 'Baixa um projeto e seu histórico de versão inteiro', inline: true },
		{ name: '\u200B', value: '\u200B' },

    );


module.exports = {
    data: new SlashCommandBuilder()
        .setName("git")
        .setDescription("Relembrar comandos do Git"),

    async execute(interaction) {
        await interaction.reply({ embeds: [exampleEmbed] })
    }
}