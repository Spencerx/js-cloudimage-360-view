import { pad } from './pad';

export const generateImagesCdnLinks = (cdnPath, { amount = 0, indexZeroBase = 0 } = {}) =>
  Array.from({ length: amount }, (_, index) => cdnPath.replace('{index}', pad(index + 1, indexZeroBase)));

export const generateGridImagesCdnLinks = (cdnPath, { amountX = 0, amountY = 0, indexZeroBase = 0 } = {}) => {
  const images = [];
  for (let y = 0; y < amountY; y++) {
    for (let x = 0; x < amountX; x++) {
      images.push(
        cdnPath
          .replace('{indexX}', pad(x + 1, indexZeroBase))
          .replace('{indexY}', pad(y + 1, indexZeroBase))
      );
    }
  }
  return images;
};
