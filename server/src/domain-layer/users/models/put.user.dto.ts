export interface PutUserDto {
    id: string;
    email: string;
    password: string;
    name: string;
    permissionLevel: number;
}