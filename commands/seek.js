const { prefix, red } = require(`../config.json`);
const func = require(`./functions.js`);

module.exports = {
  name: "seek",
  aliases: [],
  display: true,
  description:
    "Sets the playing track's position to the specified position",
  async execute(message, args, servers) {
    var server = func.getServer(message, servers);

    if (!message.member.voice.channel) {
      //not in voice
      return func.sendMessage(
        `Not in a voice channel`,
        message.channel,
        red
      );
    }
    if (!server || !server.dispatcher) {
      //nothing is playing
      return func.sendMessage(
        `Nothing is currently playing`,
        message.channel,
        red
      );
    }
    var time = parseInt(args[0]);
    if (!args[0] || isNaN(time)) {
      return func.sendMessage(
        `USAGE: ${prefix}${module.exports.name} <time in seconds>`,
        message.channel,
        red
      );
    }

    message.member.voice.channel.join().then(function (connection) {
      func.play(connection, message, server, time);
      message.react(`👍`);
    });
  },
};
