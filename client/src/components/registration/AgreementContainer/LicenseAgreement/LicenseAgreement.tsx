import React from 'react';
import classNames from 'classnames';
import { ProcessState } from '../../../../hocs/withWaiter';

import './LicenseAgreement.scss';

type LicenseAgreementProps = {
    children: React.ReactChild;
    onCancel: () => void;
    onConfirm: () => void;
    state: ProcessState;
}

function LicenseAgreement(props: LicenseAgreementProps) {
    const contentLoading = props.state !== ProcessState.Succeeded;
    return (
        <div className="license-shadow">
            <div className="license">
                <header className="license-header">
                    <h2>License agreement</h2>
                    <button className="license-close button button--danger" aria-label="close" onClick={props.onCancel}>×</button>
                </header>
                <div className='license-body'>
                    {props.children}
                </div>
                <footer className="license-footer">
                    <button
                        className="button button--primary" 
                        disabled={contentLoading}
                        onClick={props.onConfirm}
                    >
                        Agree
                    </button>
                    <button 
                        className="button button--danger"
                        onClick={props.onCancel}
                    >
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
    );
}

export { LicenseAgreement };
