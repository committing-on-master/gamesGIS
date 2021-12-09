/**
 * Проверяет что указанное свойство присутствует на T
 * При изменении имени свойства на типе Т, начинает ругаться компилятором о несоответствии заданного с свойствами типа
 * @param {name} name имя проверяемого свойства
 * @return {name} имя свойства
 */
const nameofPropChecker = <T>(name: Extract<keyof T, string>): string => name;

export {nameofPropChecker};
