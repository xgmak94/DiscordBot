const { green, red } = require(`../config.json`);
const func = require(`./functions.js`);

module.exports = {
  name: "resume",
  aliases: [`r`, `re`, `res`, `continue`, `cont`, `up`, `unpause`],
  display: true,
  description: "Resume paused track",
  async execute(message, args, servers) {
    var server = func.getServer(message, servers);

    if (server && server.dispatcher && server.dispatcher.paused) {
      server.dispatcher.resume();
      return func.sendMessage(`Resuming`, message.channel, green);
    } else {
      return func.sendMessage(
        `No track to resume`,
        message.channel,
        red
      );
    }
  },
};
