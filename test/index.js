const { levelupCard, rankcard } = require('../');
const { join } = require('path');
const { writeFileSync } = require('fs');

const root = join(__dirname, 'images');
console.log('start');
(async () => {
  const levelup = await levelupCard(
    { user: { tag: 'QwQ#owu' } },
    {
      level: 1,
      username: 'owo',
      avatar: '',
      rounded: true,
      blur: true,
    }
  );
  writeFileSync(join(root, 'levelup.png'), levelup);
  console.log('Levelup');

  const rank = await rankcard({
    text: {
      title: 'A',
      text: 'B',
      subtitle: 'C',
    },
    textColor: '#f33',
    avatar: 'https://cdn.discordapp.com/icons/945062121757089824/ba533c0a374ba2854f9df8aebbf6865b.png',
    border: true,
    rounded: true,
  });
  writeFileSync(join(root, 'rank.png'), rank);
  console.log('Rank');
})();

/*
client.on('ready', async () => {
    console.log(`Logged in as: ${client.user.tag}`);
});



client.on('message', async (msg) => {
    if (!Object.keys(themes).includes(msg.content)) return;
    const theme = themes[msg.content];
    theme.image = 'qwq.png'
    var card = await drawCard(msg.member, theme, ['welcomeText', 'userText', 'avatarImg'])

    //var buff = card.toBuffer("image/png");

    //writeFileSync('./owo.png', card.attachment);
    //console.log(card)

    msg.channel.send(new MessageAttachment(card))
    //msg.channel.send(card.toString())
})
*/
//client.login(config.token);
//client.login('Nzg3MDY4MzAwNzg5NDE1OTY3.X9PkeQ._lx9yWc2agVYggyja76fNaW08A4');
