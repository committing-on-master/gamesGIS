type Primitive = string | Function | number | boolean | Symbol | undefined | null | Date

/**
 * Оставляет только строковую трансляцию объектных свойства объекта, пропуская свойства примитивного типа и их массивы.
 * Хелпер для репозиториев TypeORM в рамках указания строковых флагов для подгрузки зависимых(relations) данных по внешним ключам.
 */
export type OnlyObjectProperties<T> = {
    [property in keyof Required<T>] : T[property] extends Primitive | Primitive[] ? never : property
} [keyof T][]
