export interface ErrorResponse<DTO=null> {
    msg?: string;
    errors?: DTO;
}
