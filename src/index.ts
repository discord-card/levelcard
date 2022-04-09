import { createCanvas, loadImage, CanvasRenderingContext2D as ctx2D, Canvas, Image } from 'canvas';
import { join } from 'path';
import { writeFileSync } from 'fs';
import '@discord-card/core';
import { CardOptions, GuildMemberLike, toImage } from './types';

const production = true;
const root = join(__dirname, '..', 'images');

var count = 0;
function snap(c: Canvas) {
  if (!production) writeFileSync(`./snapshots/${count}.png`, c.toBuffer('image/png'));
  count++;
}

export async function drawCard(options: CardOptions): Promise<Buffer> {
  const w = 700,
    h = 100;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.w = ctx.width = w;
  ctx.h = ctx.height = h;

  var background: Image;
  try {
    background = await loadImage(join(root, 'levelcard.png'));
  } catch (e) {
    throw new Error('Invalid Path or Buffer provided.');
  }

  const b = 10; //Border

  //Background
  snap(canvas);
  if (options.rounded) ctx.roundRect(0, 0, w, h, h / 15);
  else ctx.rect(0, 0, w, h);
  ctx.clip();

  if (options.border) {
    ctx.drawImage(background, 0, 0, w, h);
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;

    ctx.blur(3);
  }

  snap(canvas);
  //Rounded Edges
  if (options.border) {
    if (options.rounded) ctx.roundRect(b, b, w - 2 * b, h - 2 * b, h / 15);
    else ctx.rect(b, b, w - 2 * b, h - 2 * b);
    ctx.clip();
  } else {
    if (options.rounded) ctx.roundRect(0, 0, w, h, h / 15).clip();
    else ctx.rect(0, 0, w, h);
  }

  var temp: Canvas | Image = background;
  if (options.blur) {
    var blur = createCanvas(w, h),
      blur_ctx = blur.getContext('2d') as ctx2D;
    blur_ctx.drawImage(background, 0, 0, w, h);

    if (typeof options.blur === 'boolean') blur_ctx.blur(3);
    else blur_ctx.blur(options.blur);

    temp = blur;
  }
  if (options.border) ctx.drawImage(temp, b, b, w - b * 2, h - b * 2);
  else ctx.drawImage(temp, 0, 0, w, h);

  snap(canvas);

  //Setting Styles
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.font = '45px ' + 'sans-serif';

  //Title
  ctx.fillText(options.username, ctx.width / 5.5, ctx.height / 1.5);

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.font = '45px ' + 'sans-serif';
  ctx.fillText(options.level.toString(), ctx.width / 1.1, 100 / 1.5);

  const radius = h / 2.5;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(ctx.height / 2, ctx.height / 2, 40, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  if (options.avatar) {
    ctx.drawImage(await toImage(options.avatar), 5, 5, ctx.height / 1.2, ctx.height / 1.2);
  }
  snap(canvas);
  return canvas.toBuffer('image/png');
}

export async function levelupCard(member: GuildMemberLike, opts: CardOptions = {}): Promise<Buffer> {
  opts.username = member.user.tag ? member.user.tag : '{username}';
  opts.level = opts.level ? opts.level : 0;
  opts.avatar = opts.avatar ?? (await loadImage(member.user.displayAvatarURL({ format: 'png' })));

  const buff = await drawCard(opts);
  return buff;
}

export type RankCardOptions = {
  avatar?: Canvas | Image | Buffer | string;
  level?: number;
  blur?: boolean | number;
  border?: boolean;
  rounded?: boolean;
  barProgress?: number;
  maxBarProgress?: number;
  textColor?: string;
  barColor?: string;
  barBackground?: string;

  text?: {
    title?: string;
    subtitle?: string;
    text?: string;
  };
  textShadow?: boolean;
  theme?: string;
  outlineWidth?: number;
  outlineColor?: string;
};

export function rankcard(opts: RankCardOptions = {}): Promise<Buffer> {
  opts.level ??= 0;
  opts.maxBarProgress ??= 100;
  opts.barProgress ??= 0;

  return drawCardRank(opts);
}

async function drawCardRank(opts: RankCardOptions): Promise<Buffer> {
  const w = 700,
    h = 250;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.w = ctx.width = w;
  ctx.h = ctx.height = h;

  var background: Image;
  try {
    background = await loadImage(join(root, 'dark.png'));
  } catch (e) {
    throw new Error('Invalid Path or Buffer provided.');
  }

  const b = 10; //Border

  //Background
  if (opts.rounded) ctx.roundRect(0, 0, w, h, h / 15);
  else ctx.rect(0, 0, w, h);
  ctx.clip();

  if (opts.border) {
    ctx.drawImage(background, 0, 0, w, h);
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;

    ctx.blur(3);
  }

  //Rounded Edges
  if (opts.border) {
    if (opts.rounded) ctx.roundRect(b, b, w - 2 * b, h - 2 * b, h / 15);
    else ctx.rect(b, b, w - 2 * b, h - 2 * b);
    ctx.clip();
  } else {
    if (opts.rounded) ctx.roundRect(0, 0, w, h, h / 15).clip();
    else ctx.rect(0, 0, w, h);
  }

  var temp: Canvas | Image = background;
  if (opts.blur) {
    var blur = createCanvas(w, h),
      blur_ctx = blur.getContext('2d') as ctx2D;
    blur_ctx.drawImage(background, 0, 0, w, h);

    if (typeof opts.blur === 'boolean') blur_ctx.blur(3);
    else blur_ctx.blur(opts.blur);

    temp = blur;
  }
  if (opts.border) ctx.drawImage(temp, b, b, w - b * 2, h - b * 2);
  else ctx.drawImage(temp, 0, 0, w, h);

  //Setting Styles
  ctx.fillStyle = opts.textColor ?? '#fff';
  ctx.strokeStyle = opts.textColor ?? '#fff';
  ctx.font = '30px ' + 'sans-serif';
  if (opts.textShadow) {
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
  }

  ctx.changeFontSize('30px').fillText(opts.text?.title ?? '', ctx.width / 2.9, ctx.height / 3.5);
  //Text
  if (opts.text?.text) {
    const text = `Level ${opts.level} (${opts.barProgress})XP`;
    ctx.changeFontSize('25px').fillText(text, ctx.width / 2.9, ctx.height / 2.1);
  }
  ctx.shadowColor = 'transparent';
  //Subtitle
  if (opts.text?.subtitle) {
    ctx.changeFontSize('18px').fillText(opts.text?.subtitle, ctx.width / 2.9, ctx.height / 1.12);
  }
  //ProgressBar
  const percentage = Math.floor((opts.barProgress / opts.maxBarProgress) * 100);
  const roundedPercent = Math.round(percentage);
  var i;
  for (i = 0; i < 100; i++) {
    ctx.beginPath();
    ctx.lineWidth = 14;
    ctx.strokeStyle = opts.barBackground ?? '#323945';
    ctx.fillStyle = opts.barBackground ?? '#323945';
    ctx.arc(240 + i * 4.22, 190, 8, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.fill();
  }

  for (i = 0; i < roundedPercent; i++) {
    ctx.beginPath();
    ctx.lineWidth = 14;
    ctx.strokeStyle = opts.barColor ?? '#7d333e';
    ctx.fillStyle = opts.barColor ?? '#7d333e';
    ctx.arc(240 + i * 4.22, 190, 8, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.fill();
  }

  ctx.fillStyle = opts.textColor ?? '#fff';
  ctx.changeFontSize('20px').fillText(opts.barProgress + ' / ' + opts.maxBarProgress, ctx.width / 1.7, ctx.height / 1.27);

  //Avatar Image
  const radius = h / 2.5;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(h / 2, h / 2, radius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  const { avatar } = opts;
  if (avatar) {
    const { outlineWidth, outlineColor } = opts;

    ctx.drawImage(
      await toImage(avatar),
      h / 2 - radius + (opts.outlineWidth ?? 0), //x
      h / 2 - radius + (opts.outlineWidth ?? 0), //y
      radius * 2 - (opts.outlineWidth ?? 0) * 2, //width
      radius * 2 - (opts.outlineWidth ?? 0) * 2 //height
    );

    if (outlineWidth) {
      ctx.beginPath();
      ctx.arc(h / 2, h / 2, radius - outlineWidth / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.lineWidth = outlineWidth;
      ctx.strokeStyle = opts.outlineColor ?? ' #fff';
      ctx.stroke();
    }
  }
  return canvas.toBuffer('image/png');
}
