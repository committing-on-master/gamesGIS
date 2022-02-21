/**
 * Проверяет что указанное свойство присутствует на T
 * При изменении имени свойства на типе Т, начинает ругаться компилятором о несоответствии заданного с свойствами типа
 * @param {object} name имя проверяемого свойства
 * @return {string} имя свойства
 */
 const nameofPropChecker = <T>(name: Extract<keyof T, string>): string => name;

 export { nameofPropChecker };