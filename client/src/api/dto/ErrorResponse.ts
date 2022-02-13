export interface ErrorResponse<DTO=null> {
    message?: string;
    errors?: DTO;
}
