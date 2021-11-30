import { FieldError } from "react-hook-form";

/**
 * Костыльные типы для проброса в пропсах в процессе валидации форм
 * Плодят объекты с именами полей полученных из инпутов
 * Обещаю так больше не делать, но это не точно
 */

/**Тип для проброса ошибок полученных с помощью react-hook-form */
export type FieldErrorDescription<Fields> = {
    [property in keyof Fields]?: FieldError | undefined
}

/**Тип для проброса ошибок полученных с бэкенда с каким-нить MapType-ом*/
export type CustomErrorsDescription<Fields, MapType> = {
    [property in keyof Fields as `${string & property}Backend`]?: MapType
}

/**
 * Выводит поля с ошибками валидации для переданного Input
 * @type {Fields} - Валидируемые инпуты в компоненте
 * @type {BackendErrorsDto} - формат, в котором сервер присылает результаты валидации соответствующий полей
 */
export type CustomFieldErrors<Fields, BackendErrorsDto = string> 
    = FieldErrorDescription<Fields>
    & CustomErrorsDescription<Fields, BackendErrorsDto>