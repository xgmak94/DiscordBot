const { prefix, red, green } = require(`../config.json`);
const func = require(`./functions.js`);

module.exports = {
  name: "volume",
  aliases: [`v`, `vol`],
  display: true,
  description: "Adjusts the volume of the track",
  async execute(message, args, servers) {
    var server = func.getServer(message, servers);

    if (!server || !server.dispatcher) {
      return func.sendMessage(
        `No track is currently playing`,
        message.channel,
        red
      );
    }

    if (!args[0]) {
      return func.sendMessage(
        `Current volume: ${server.dispatcher.volume * 100}`,
        message.channel,
        green
      );
    }

    var newVol = parseInt(args[0]);
    if (isNaN(newVol) || newVol < 0 || newVol > 200) {
      return func.sendMessage(
        `Usage ${prefix}volume <#0-200>`,
        message.channel,
        red
      );
    }

    server.dispatcher.setVolume(args[0] / 100); //100 is normal, 200 is double, 50 is half
    return func.sendMessage(
      `Volume changed to ${args[0]}`,
      message.channel,
      green
    );
  },
};
