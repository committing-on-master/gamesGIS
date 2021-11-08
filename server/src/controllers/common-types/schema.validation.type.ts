import { ParamSchema } from 'express-validator';

/**
 * Создаем тип для валидации полей request-а переданной DTO-шки
 * Выведенный тип будет требовать схему валидации для каждого свойства DTO объекта
 */
type SchemaValidationProps<DTO> = {
    [Property in keyof Required<DTO>]: ParamSchema;
};

export { SchemaValidationProps };