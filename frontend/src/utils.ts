import { RcFile } from 'antd/es/upload';

export const getBase64 = (img: RcFile, fn: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => fn(reader.result as string));
  reader.readAsDataURL(img);
};
const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};
export const getRandomColor = (index?: number) => {
  const colorList = [
    '#70A7EF',
    '#FF7C7C',
    '#FFB723',
    '#58C600',
    '#1C2965',
    '#704D92'
  ];
  if (typeof index === 'number') {
    return colorList[index];
  }
  return colorList[getRandomInt(colorList.length)];
};
