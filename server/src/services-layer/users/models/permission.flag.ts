/**
 * Права доступа
 * шаг ^2 => 1 2 4 8 16 32 ... 2147483647
 */
enum PermissionFlag {
    REGISTERED_USER = 1,
    APPROVED_USER = 2,
    // Новые права добавлять тут, сдвигая админа дальше на х2 значение
    ADMIN_PERMISSION = 4
}

export { PermissionFlag }