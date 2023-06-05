export enum questionTypeTextEnum {
  RADIO = 'single choice',
  CHECKBOX = 'multiple choice'
}

export enum questionStatusEnum {
  RADIO = 0,
  CHECKBOX = 1
}

export const QuestionTypeTypeMap: Map<
  questionStatusEnum,
  questionTypeTextEnum
> = (() => {
  const map = new Map<questionStatusEnum, questionTypeTextEnum>();
  map.set(questionStatusEnum.RADIO, questionTypeTextEnum.RADIO);
  map.set(questionStatusEnum.CHECKBOX, questionTypeTextEnum.CHECKBOX);
  return map;
})();
