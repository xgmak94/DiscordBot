const Discord = require(`discord.js`);
const { prefix, green, red } = require(`../config.json`);
const func = require(`./functions.js`);

module.exports = {
  name: "search",
  aliases: [`find`],
  display: true,
  description: "Searches youtube for videos using keywords",
  async execute(message, args, servers) {
    var server = func.getServer(message, servers);

    if (!args[0]) {
      //enter a strng to search
      return func.sendMessage(
        `USAGE: ${prefix}${module.exports.name} <string>`,
        message.channel,
        red
      );
    }
    displaySearch(message, args, server);
  },
};

async function displaySearch(message, args, server) {
  var search = await func.search(args);
  var res = search.splice(0, 5);
  var embed = new Discord.MessageEmbed().setColor(green);

  for (var i = 0; i < 5; i++) {
    var video = res[i];
    embed.addFields({
      name: i + 1 + `.`,
      value: `[${video.title}](${video.url})(\`${video.timestamp}\`)`,
    });
  }
  message.channel.send(embed);
}
