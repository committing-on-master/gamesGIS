import { useState } from "react";
import { AgreementText } from "../AgreementText";

interface LicenseAgreementProps {
    /**endpoint с которого будет загружено пользовательское соглашение */
    endPoint: string;
    /**событие подтверждения лицензионного соглашения */
    onConfirm?(): void;
    /**событие отказа от лицензионного соглашения */
    onCancel?(): void;
}

function LicenseAgreement(props: LicenseAgreementProps) {
    const [agreementTextLoading, setAgreementTextLoading] = useState(true);
    const [modalVisibility, setModalVisibility] = useState(true);

    function onAgreementTestLoaded() {
        setAgreementTextLoading(false);
    }

    function handleConfirm() {
        setModalVisibility(false);
    }
    
    const modalClass = modalVisibility? "modal is-active" : "modal";

    return (
        <div className={modalClass}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">License agreement</p>
                    <button className="delete" aria-label="close" onClick={props.onCancel}></button>
                </header>
                <AgreementText endPoint={props.endPoint} onTextLoaded={onAgreementTestLoaded}/>
                <footer className="modal-card-foot">
                    <button className="button is-success" disabled={agreementTextLoading} onClick={handleConfirm}>Agree</button>
                    <button className="button" onClick={props.onCancel}>Cancel</button>
                </footer>
            </div>
        </div>
    )
}

export { LicenseAgreement }
