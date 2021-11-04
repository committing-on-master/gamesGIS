interface CreateUserDto {
    id?: string,
    email: string,
    password: string,
    name: string,
    permissionFlags?: number
}

export { CreateUserDto }