import { SuccessResponse } from "./../SuccessResponse";

interface Payload {
    version: number;
    agreementText: string;
}

export interface AgreementDTO extends SuccessResponse<Payload> {}
