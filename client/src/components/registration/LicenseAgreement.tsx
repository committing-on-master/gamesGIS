import { useEffect, useState } from "react";
import { AgreementText } from "./AgreementText";

interface LicenseAgreementProps {
    /**endpoint с которого будет загружено пользовательское соглашение */
    endPoint: string;
    /**событие подтверждения лицензионного соглашения */
    onConfirm(): void;
    /**событие отказа от лицензионного соглашения */
    onCancel(): void;
}

function LicenseAgreement(props: LicenseAgreementProps) {
    const [agreementTextLoading, setagreementTextLoading] = useState(true);

    function onAgreementTestLoaded() {
        setagreementTextLoading(false);
    }
    const confirmButtonClass = agreementTextLoading ? "button is-success" : "button is-success";

    return (
        <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">License agreement</p>
                    <button className="delete" aria-label="close" onClick={props.onCancel}></button>
                </header>
                <AgreementText endPoint={props.endPoint} onLoaded={onAgreementTestLoaded}/>
                <footer className="modal-card-foot">
                    <button className="button is-success" disabled={agreementTextLoading} onClick={props.onConfirm}>Agree</button>
                    <button className="button" onClick={props.onCancel}>Cancel</button>
                </footer>
            </div>
        </div>
    )
}

export { LicenseAgreement }
