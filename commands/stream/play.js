const Commando = require('discord.js-commando');
const env = require('../../config/env');
const embed = require('../../utils/embed');

class Play extends Commando.Command {
  static options() {
    return {
      usage: `${env.client.prefix} play <url of the stream to play>`,
      name: 'play',
      group: 'stream',
      memberName: 'play',
      description: 'Play the sound of a video stream in channel to all users',
      details: 'Everyone should enjoy some music',
      examples: [
        `${env.client.prefix} play http://youtube.com/link-to-your-favorite-song`,
      ],
      guildOnly: true,
      args: [
        {
          key: 'url',
          prompt: 'Link (url) of a stream to play the sound of the video',
          type: 'integer',
          // Validate with a URL Regex
          // validate: (deleteCount) => deleteCount && deleteCount > 1 && deleteCount < 101,
          label: 'url of the stream to play',
        },
      ],
    };
  }

  constructor(client) {
    super(client, Play.options());
  }

  async run(message, { url }) {
    const { voiceChannel } = message.member;

    if (!voiceChannel) {
      return message.reply('To execute this command you should connect to a voice channel');
    }

    if (message.guild.voiceConnection
      && voiceChannel.position !== message.guild.voiceConnection.channel.position) {
      return message.reply('To execute this command you should be connected to the same voice channel as the bot');
    }

    try {
      if (!message.guild.voiceConnection) {
        // Bot is not connected to a voice channel

        await voiceChannel.join();
        message.channel.send(`**Connected to** \`${voiceChannel.name}\` successfully. :yum:`);
      }

      const { guild, channel } = message;
      let streamer = global.Radio.getStream(message.guild.id);
      if (!streamer) {
        streamer = global.Radio.createStream(
          guild.id,
          channel.id,
          guild.voiceConnection,
        );
      }

      const video = streamer.play(url, message.author.id);
      let answer;
      if (video.status === 'queued') {
        answer = embed.create();
        answer
          .setTitle(`${video.info.title}`)
          .setURL(video.url)
          .setAuthor('Adicionado a fila', message.member.user.avatarURL)
          .addField('Canal', video.info.author.name)
          .addField('Duração', video.duration)
          .addField('Posição na fila', video.positionOnQueue);
      }

      answer = (answer) || `**Tocando** \`${video.info.title}\` agora`;
      return message.channel.send(answer);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Play;