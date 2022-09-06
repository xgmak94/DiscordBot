const ytdl = require(`ytdl-core`);
const Discord = require("discord.js");
const { green, yellow, red } = require(`../config.json`);
const func = require(`./functions.js`);

module.exports = {
  name: "play",
  aliases: [],
  display: true,
  description: "Plays music from a youtube link.",
  async execute(message, args, servers) {
    var server = func.getServer(message, servers);

    if (!message.member.voice.channel) {
      //need a voice channel
      return func.sendMessage(
        `You have to be connected to a voice channel to use this command`,
        message.channel,
        red
      );
    }
    if (!args[0]) {
      //no link/invalid link
      return func.sendMessage(
        `Please use a valid \`youtube\` URL`,
        message.channel,
        red
      );
    }

    var url = args[0];
    if (!ytdl.validateURL(url) || args.length > 1) {
      //search for song using args if url is invalid
      var search = await func.search(args);
      url = search.shift().url;
    }
    var info = await ytdl.getBasicInfo(url);
    var song = {
      url: url,
      info: info,
    };
    server.queue.push(song); //queue containing the youtube url and basic info

    if (!message.guild.me.voice.channel || !server.dispatcher)
      message.member.voice.channel
        .join()
        .then(function (connection) {
          connection.voice.setDeaf(true);
          func.play(connection, message, server, 0);
        })
        .catch(console.error);
    else {
      //if we are playing a song already add it to que instead
      queued(message, args, server, song);
    }
  },
};

function queued(message, args, server, song) {
  var embed = new Discord.MessageEmbed().setColor(green);

  embed.addFields({
    name: `Added to que:`,
    value: `[${song.info.videoDetails.title}](${song.url})`,
  });

  return message.channel.send(embed);
  // .then((msg) => {
  //   msg.delete({ timeout: 5000 });
  // });
}
