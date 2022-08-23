const { green, red } = require(`../config.json`);
const func = require(`./functions.js`);

module.exports = {
  name: "join",
  aliases: [`j`, `enter`],
  display: true,
  description: "Summons the bot to your voice channel.",
  async execute(message, args, servers) {
    var server = func.getServer(message, servers);

    if (!message.member.voice.channel) {
      return func.sendMessage(
        `You are not in a voice channel`,
        message.channel,
        red
      );
    }
    if (
      (message.guild.me.voice.channel = message.member.voice.channel)
    ) {
      return func.sendMessage(
        `You are in the same voice channel`,
        message.channel,
        green
      );
    }

    if (
      message.member.voice.channel &&
      message.guild.me.voice.channel != message.member.voice.channel
    ) {
      //bot is in a different channel than user
      await message.member.voice.channel.join();
      message.react(`👍`);
    }
  },
};
