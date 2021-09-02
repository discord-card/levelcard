
# Discord Level Card

[![NPM Version](https://img.shields.io/npm/v/@discord-card/levelcard?color=00DEC8&style=for-the-badge)](https://www.npmjs.com/package/@discord-card/levelcard)
[![NPM Downloads](https://img.shields.io/npm/dt/@discord-card/levelcard?color=00DEC8&style=for-the-badge)](https://www.npmjs.com/package/@discord-card/levelcard)
[![NPM License](https://img.shields.io/npm/l/@discord-card/levelcard?color=00DEC8&style=for-the-badge)](https://www.npmjs.com/package/@discord-card/levelcard)
[![Github Size](https://img.shields.io/github/repo-size/discord-card/levelcard?color=00DEC8&label=SIZE&style=for-the-badge)](https://www.npmjs.com/package/@discord-card/levelcard)

**[![widget](https://discord.com/api/guilds/553942677117337600/widget.png?style=banner2)](https://discord.gg/Emk2udJ)**

#  Discord Level Card
Simple Levelup cards

## Examples

```javascript
const Discord = require("discord.js");
const { levelupCard } = require('@discord-card/levelcard');
const client = new Discord.Client();

client.on("message", async message => {
    const image = await levelupCard(message.member, {level: 1});

    message.channel.send(new Discord.MessageAttachment(image, 'welcome.png'))
});

client.login('Your-Bot-Token');
```
![Image](examples/card1.png)

<br />