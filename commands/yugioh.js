const Discord = require(`discord.js`);
const { SystemChannelFlags } = require("discord.js");
const { prefix, red, green, yugiohURL } = require(`../config.json`);
const func = require(`./functions.js`);
const Axios = require("axios");

module.exports = {
  name: "yugioh",
  aliases: [`ygo`, `yugi`, `yu-gi-oh`],
  display: true,
  description: "Searches for information on a specified card",
  async execute(message, args, servers) {
    var server = func.getServer(message, servers);

    if (!args[0]) {
      return func.sendMessage(
        `You must specify a card to search for`,
        message.channel,
        red
      );
    }

    var cardName = args.join(" ");
    var url = `${yugiohURL}?fname=${cardName}`;
    console.log(url);
    try {
      var ret = await Axios.get(url);
      var data = ret.data.data;
      var totalLength = data.length;
      var numShow = Math.min(5, totalLength);
    } catch (err) {
      console.log(err.message);
      return func.sendMessage(
        `Could not find the card ${cardName}`,
        message.channel,
        red
      );
    }

    //MORE THAN 1 CARD, WE SHOULD SHOW SOME OF THEIR NAMES ATLEAST
    if (totalLength > 1) {
      var embed = new Discord.MessageEmbed().setColor(green);
      embed.setTitle(`Showing ${numShow} of ${totalLength} cards`);
      embed.setDescription(`Cards with the name '${cardName}'`);
      for (var i = 0; i < numShow; i++) {
        var card = data[i];
        var smallImage = card.card_images[0].image_url_small;
        embed.addFields({
          name: `${i + 1}.`,
          value: `[${card.name}](${smallImage})`,
        });
      }
      message.channel.send(embed);
      return;
    }

    //ONLY 1 CARD, LETS SHOW IT
    var card = data[0];
    var embed = new Discord.MessageEmbed().setColor(green);
    embed.setTitle(`${card.name}`);
    embed.setURL(card.card_images[0].image_url);
    embed.setThumbnail(card.card_images[0].image_url);
    embed.setDescription(setDescription(card));

    message.channel.send(embed);

    console.log(card);
  },
};

function setCardLevel(card) {
  var type = card.type.split(" ");
  type = type[0]; //LINK, XYZ, SYNCHRO ETC

  var cardLevel = `Level ${card.level}`; //default
  if (type === "XYZ") {
    //THEY HAVE RANKS INSTEAD
    cardLevel = `Rank ${card.level}`;
  } else if (type === "Link") {
    //THEY HAVE LINK LEVELS INSTEAD
    cardLevel = `Link ${card.linkval}`;
  } else if (type === "Pendulum") {
    cardLevel = cardLevel + ` Scale ${card.scale}`;
  }
  return cardLevel;
}
function setCardStats(card) {
  var type = card.type.split(" ");
  type = type[0]; //LINK, XYZ, SYNCHRO ETC

  var cardStats = `${card.atk} ATK / ${card.def} DEF`;
  if (type === "Link") {
    //LINK MONSTERS HAVE NO DEF POINTS
    cardStats = `${card.atk} ATK`;
  }
  return cardStats;
}
function setCardType(card) {
  var cardType = `${card.attribute}/${card.race}/${card.type}`;
  if (card.attribute === undefined) {
    //spell/trap
    cardType = `${card.race}/${card.type}`;
  }
  return cardType;
}
function setDescription(card) {
  var cardLevel = setCardLevel(card);
  var cardStats = setCardStats(card);
  var cardType = setCardType(card); //attribute, type, type of monster or spell/trap

  var str = `${cardType}\n${card.desc}`;

  if (card.attribute !== undefined) {
    //monster card
    str = `${cardType}\n${cardLevel}\n${cardStats}\n${card.desc}`;
  }
  return str;
}
