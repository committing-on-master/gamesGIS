import { useState } from "react";
import { AgreementText } from "../AgreementText";

import "./LicenseAgreement.scss";

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

    function onAgreementTestLoaded() {
        setAgreementTextLoading(false);
    }

    return (
        <div className="license-shadow">
            <div className="license">
                <header className="license-header">
                    <h2>License agreement</h2>
                    <button className="license-close button button--danger" aria-label="close" onClick={props.onCancel}>×</button>
                </header>
                <AgreementText endPoint={props.endPoint} onTextLoaded={onAgreementTestLoaded} />
                <footer className="license-footer">
                    <button className="button button--primary" disabled={agreementTextLoading} onClick={props.onConfirm}>Agree</button>
                    <button className="button button--danger" onClick={props.onCancel}>Cancel</button>
                </footer>
            </div>
        </div>
    )
}

export { LicenseAgreement }
