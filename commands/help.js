const Discord = require(`discord.js`);
const fs = require("fs");
const func = require(`./functions.js`);

module.exports = {
  name: "help",
  aliases: [],
  display: true,
  description: "Shows all usable commands.",
  async execute(message, args, servers) {
    var server = func.getServer(message, servers);

    var map = message.client.commands;
    displayHelp(message, map);
  },
};

function displayHelp(message, map) {
  var embed = new Discord.MessageEmbed();
  for (var [key, value] of map.entries()) {
    if (!value.display) continue; //only display commands that are allowed
    var commandName = key.charAt(0).toUpperCase() + key.slice(1);
    embed.addFields({
      name: commandName,
      value: value.description,
    });
  }
  message.channel.send(embed);
}
