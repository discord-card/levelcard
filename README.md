
# Discord Level Card


[![NPM Version](https://img.shields.io/npm/v/discord-welcome-card?color=00DEC8&style=for-the-badge)](https://www.npmjs.com/package/discord-welcome-card)
[![NPM Downloads](https://img.shields.io/npm/dt/discord-welcome-card?color=00DEC8&style=for-the-badge)](https://www.npmjs.com/package/discord-welcome-card)
[![NPM License](https://img.shields.io/npm/l/discord-welcome-card?color=00DEC8&style=for-the-badge)](https://www.npmjs.com/package/discord-welcome-card)
[![Github Size](https://img.shields.io/github/repo-size/AKORA-Studios/DiscordWelcomeCard?color=00DEC8&label=SIZE&style=for-the-badge)](https://www.npmjs.com/package/discord-welcome-card)

**[![widget](https://discord.com/api/guilds/553942677117337600/widget.png?style=banner2)](https://discord.gg/Emk2udJ)**

#  Discord Level Card
Simple Levelup cards

## Examples

```javascript
const Discord = require("discord.js");
const { levelupCard } = require('discord-welcome-card');
const client = new Discord.Client();

client.on("message", async message => {
    const image = await levelupCard(message.member, {level: 1});

    message.channel.send(new Discord.MessageAttachment(image, 'welcome.png'))
});

client.login('Your-Bot-Token');
```
![Image](examples/card1.png)

<br />

##  Changelog
| Version  | Content |
| ------------- | ------------- |
| 1.0 | new card background  |


