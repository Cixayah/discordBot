const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { MessageActionRow, MessageButton } = require('discord.js');

async function playMusic(voiceChannel, url) {
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const stream = ytdl(url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    player.on('error', error => {
        console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
    });

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('previous')
                .setLabel('Previous')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('play_pause')
                .setLabel('Pause')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle('PRIMARY'),
        );

    // Send the buttons to a text channel
    const textChannel = voiceChannel.guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT');
    await textChannel.send({ content: 'Control playback:', components: [row] });

    // Handle button interactions
    const filter = i => i.customId === 'previous' || i.customId === 'play_pause' || i.customId === 'next';
    const collector = textChannel.createMessageComponentCollector({ filter });

    collector.on('collect', async i => {
        if (i.customId === 'previous') {
            // Handle previous button click
        } else if (i.customId === 'play_pause') {
            if (player.state.status === AudioPlayerStatus.Playing) {
                player.pause();
                i.update({ content: 'Control playback:', components: [row] });
            } else {
                player.unpause();
                i.update({ content: 'Control playback:', components: [row] });
            }
        } else if (i.customId === 'next') {
            // Handle next button click
        }
    });
}
