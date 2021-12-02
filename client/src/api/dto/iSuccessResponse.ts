export interface iSuccessResponse<DTO={}> {
    msg: string;
    payload: DTO;
}