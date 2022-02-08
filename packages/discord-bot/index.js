const { Client, Intents } = require("discord.js");
require('dotenv').config();

const discordToken = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.on("ready", async () => {
  console.log("ready...");
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "/hello") {
    message.channel.send("HELLO!");
  }
});

client.login(discordToken);