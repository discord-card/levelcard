import { Canvas, Image, loadImage } from 'canvas';

export interface GuildMemberLike {
  user: {
    tag: string;
    displayAvatarURL(options?: { dynamic?: boolean; format?: 'gif' | 'webp' | 'png' | 'jpg' | 'jpeg' }): string;
  };
  guild: {
    memberCount: number;
  };
}

export type ImageResolvable = Canvas | Image | Buffer | string;

export type CardOptions = {
  username?: string;
  avatar?: ImageResolvable;
  level?: number;
  blur?: boolean | number;
  border?: boolean;
  rounded?: boolean;
};

export async function toImage(image: ImageResolvable, name?: string) {
  if (image instanceof Canvas) {
    let img = new Image();
    img.src = (image as Canvas).toDataURL();
    return img;
  } else if (image instanceof Image) return image;
  else if (typeof image === 'string' || image instanceof Buffer) return await loadImage(image);
  else throw new Error('Invalid Image Format for: ' + name ?? 'Image');
}
