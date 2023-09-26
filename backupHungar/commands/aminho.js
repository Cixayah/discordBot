const { SlashCommandBuilder } = require("discord.js")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("aminho")
        .setDescription("Uma playlist do casal mais lindo das galáxias."),

    async execute(interaction) {
        await interaction.reply("https://open.spotify.com/playlist/723PwpAlSlPF6hq7uoEZtT?si=873b4d4a541d4b98&nd=1")
    }
}