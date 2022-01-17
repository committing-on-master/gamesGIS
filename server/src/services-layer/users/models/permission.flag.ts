/* eslint-disable no-unused-vars */
/**
 * Права доступа
 * шаг ^2 => 1 2 4 8 16 32 ... 2147483647
 */
enum PermissionFlag {
    UNDEFINED = 0,
    REGISTERED_USER = 1,
    APPROVED_USER = 2,
    ADMIN_PERMISSION = 4
}

export {PermissionFlag};
