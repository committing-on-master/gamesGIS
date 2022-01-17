export interface SuccessResponse<DTO={}> {
    message: string;
    payload: DTO;
}
