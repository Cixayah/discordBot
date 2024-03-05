const { SlashCommandBuilder } = require("discord.js");
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

        if (!channel) {
            await interaction.reply('Você precisa estar em um canal de voz para usar este comando!');
            return;
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        const player = createAudioPlayer();

        // Check if the player is already playing
        if (player.state.status !== AudioPlayerStatus.Idle) {
            await interaction.reply('Já estou tocando uma música. Use os controles ou digite uma nova música.');
            return;
        }

        let resource;
        try {
            if (url.includes('youtube.com')) {
                resource = createAudioResource(ytdl(url));
            } else if (url.includes('spotify.com')) {
                const preview = await getPreview(url);
                resource = createAudioResource(preview.audio);
            }
        } catch (error) {
            console.error(`Erro ao obter a música: ${error.message}`);
            await interaction.reply('Ops! Ocorreu um erro ao buscar a música. Tente novamente.');
            return;
        }

        player.play(resource);
        connection.subscribe(player);
        await interaction.reply(`Tocando música: ${url}`);

        // Adicionando botões de controle
        const row = new ActionRowBuilder() // Substituímos MessageActionRow
            .addComponents(
                new ButtonBuilder() // Substituímos MessageButton
                    .setCustomId('play')
                    .setLabel('Play')
                    .setStyle('Primary'), // Notar maiúscula em 'Primary'
                new ButtonBuilder()
                    .setCustomId('pause')
                    .setLabel('Pause')
                    .setStyle('Primary'),
                new ButtonBuilder()
                    .setCustomId('stop')
                    .setLabel('Stop')
                    .setStyle('Danger'),
                new ButtonBuilder()
                    .setCustomId('skip')
                    .setLabel('Skip')
                    .setStyle('Secondary'),
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
                connection.destroy();
            } else if (i.customId === 'skip') {
                // Adicione aqui o código para pular para a próxima música na fila
            }
            i.reply({ content: `Clicou em ${i.customId}`, ephemeral: true });
        });
    }
};
