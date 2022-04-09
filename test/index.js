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