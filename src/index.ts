import { GuildMember } from 'discord.js';
import { createCanvas, loadImage, CanvasRenderingContext2D as ctx2D, Canvas, Image } from 'canvas';
import { join } from 'path';
import { writeFileSync } from "fs";
import '@discord-card/core';

const production = true;

const root = join(__dirname, '..', 'images');

export type ModuleFunction = (ctx: ctx2D) => any
export type CardOptions = {
    username?: string;
    avatar?: Canvas | Image | Buffer | string;
    level?: number;
    blur?: boolean | number;
    border?: boolean;
    rounded?: boolean;
}

var count = 0;
function snap(c: Canvas) {
    if (!production) writeFileSync(`./snapshots/${count}.png`, c.toBuffer('image/png'));
    count++;
}

export async function drawCard(options: CardOptions): Promise<Buffer> {
    const w = 700, h = 100;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext('2d');
    ctx.w = ctx.width = w;
    ctx.h = ctx.height = h;

    var background: Image;
    try {
        background = await loadImage(join(root, 'levelcard.png'));
    } catch (e) { throw new Error('Invalid Path or Buffer provided.') }

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
        else ctx.rect(b, b, w - (2 * b), h - (2 * b));
        ctx.clip();
    } else {
        if (options.rounded) ctx.roundRect(0, 0, w, h, h / 15).clip();
        else ctx.rect(0, 0, w, h);
    }


    var temp: Canvas | Image = background;
    if (options.blur) {
        var blur = createCanvas(w, h), blur_ctx = blur.getContext('2d') as ctx2D;
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
    ctx.lineWidth = 6
    ctx.beginPath();
    ctx.arc(ctx.height / 1.5, ctx.height / 1.5, 40, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    if (options.avatar) {
        if (options.avatar instanceof Canvas || options.avatar instanceof Image)
            ctx.drawImage(options.avatar, 5, 5, ctx.height, ctx.height);
        else if (typeof options.avatar === 'string' || options.avatar instanceof Buffer)
            ctx.drawImage(await loadImage(options.avatar), 5, 5, ctx.height, ctx.height);
        else throw new Error('Invalid Avatar Argument');
    }
    snap(canvas);
    return canvas.toBuffer('image/png');
}


export async function levelupCard(member: GuildMember, opts: CardOptions = {}): Promise<Buffer> {
    opts.username = member.user.tag ? member.user.tag : '{username}'
    opts.level = opts.level ? opts.level : 0
    opts.avatar = opts.avatar ?? await loadImage(member.user.displayAvatarURL({ format: 'png' }));

    const buff = await drawCard(opts);
    return buff;
}
