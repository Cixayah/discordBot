const { SlashCommandBuilder } = require("discord.js")
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { getPreview } = require('spotify-url-info');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Toca uma música no canal de voz")
        .addStringOption(option => option.setName('url').setDescription('URL da música').setRequired(true)),

    async execute(interaction) {
        const url = interaction.options.getString('url');
        const channel = interaction.member.voice.channel;
        if (channel) {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });
            const player = createAudioPlayer();
            let resource;
            if (url.includes('youtube.com')) {
                resource = createAudioResource(ytdl(url));
            } else if (url.includes('spotify.com')) {
                const preview = await getPreview(url);
                resource = createAudioResource(preview.audio);
            }
            player.play(resource);
            connection.subscribe(player);
            await interaction.reply(`Tocando música: ${url}`);

            // Adicionando botões de controle
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('play')
                        .setLabel('Play')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('pause')
                        .setLabel('Pause')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('stop')
                        .setLabel('Stop')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('skip')
                        .setLabel('Skip')
                        .setStyle('SECONDARY'),
                );
            await interaction.reply({ content: 'Controles:', components: [row] });

            // Adicionando listener para os botões
            const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });
            collector.on('collect', i => {
                if (i.customId === 'play') {
                    player.unpause();
                } else if (i.customId === 'pause') {
                    player.pause();
                } else if (i.customId === 'stop') {
                    player.stop();
                } else if (i.customId === 'skip') {
                    // Adicione aqui o código para pular para a próxima música na fila
                }
                i.reply({ content: `Clicou em ${i.customId}`, ephemeral: true });
            });
        } else {
            await interaction.reply('Você precisa estar em um canal de voz para usar este comando!');
        }
    }
}
