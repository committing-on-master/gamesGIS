import { ParamSchema } from 'express-validator';

/**
 * Создаем тип для валидации полей request-а переданной DTO-шки
 * Выведенный тип будет требовать схему валидации для каждого not nullable свойства DTO объекта
 */
type SchemaValidationProps<DTO> = {
    [Property in keyof NonNullable<DTO>]: ParamSchema;
};

export { SchemaValidationProps };