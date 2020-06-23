const fetch = require("node-fetch");
const Discord = require("discord.js");

module.exports = {
  name: "user-orgs",
  description: "Tells github info",
  async execute(message, args) {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    // const trim = (str, max) =>
    //   str.length > max ? `${str.slice(0, max - 3)}...` : str;

    if (!args.length) {
      return message.channel.send("You need to supply a search term!");
    }

    var list = [];
    list = await fetch(`https://api.github.com/users/${args}/orgs`, {
      headers: {
        authorization: "token " + process.env.GITHUB_TOKEN,
      },
    }).then((response) => response.json());

    const embed = new Discord.MessageEmbed()
    .setColor("#" + randomColor)
    .setTitle("Org Count: "+ list.length);

  if (list.length) {
    for (let i = 0; i < list.length && i<24; i++) {
      var link = list[i].html_url;
      var org = list[i].login;
        var count = i + 1;
      embed.addFields({
        name: "Org #" + count,
        value: `[${org}](${link})`,
        inline: true,
      });
    }
    if(list.length>25){
        embed.addFields({
            name: "Limit Reached",
            value: "25 is the max limit",
          });
    }
  } else {
    embed.addFields({
      name: "error",
      value: "This User has no org",
    });
  }

  message.channel.send(embed);
  },
};