const Discord = require(`discord.js`);
const { prefix, red, green } = require(`../config.json`);
const func = require(`./functions.js`);

module.exports = {
  name: "queue",
  aliases: ["q"],
  display: true,
  description:
    "Shows all tracks that are currently queued up for play.",
  async execute(message, args, servers) {
    var server = func.getServer(message, servers);

    if (server && server.queue.length > 0) {
      displayQueue(message, args, server);
    } else {
      return func.sendMessage(
        `Queue is empty, add a song by using ${prefix}play`,
        message.channel,
        red
      );
    }
  },
};

function displayQueue(message, args, server) {
  var embed = new Discord.MessageEmbed();

  for (var i = 0; i < server.queue.length; i++) {
    //add a section to message for each queued song
    var song = server.queue[i];
    embed.addFields({
      name: i + 1 + `.`,
      value: `[${song.info.videoDetails.title}](${song.url})`,
    });
  }
  message.channel.send(embed);
  // .then((msg) => {
  //   msg.delete({ timeout: 10000 });
  // });
}
