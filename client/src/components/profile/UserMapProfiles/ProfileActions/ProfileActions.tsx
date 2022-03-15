import React from 'react';
import { MapProfileReviewType } from '../../../../api/dto/response/ProfilesDTO';
import { LinkButton } from '../../../common/LinkButton';

import styles from './ProfileActions.module.scss';

interface ProfileActionsProps {
    record: MapProfileReviewType;
    onDeletionClick(profileId: number): void;
}
function ProfileActions(props: ProfileActionsProps) {
    return (
        <div>
            <LinkButton className={styles.button} to={`/map/${props.record.name}`}>Open map</LinkButton>
            <button
                className={`${styles.button} ${styles.buttonDanger}`}
                onClick={() => props.onDeletionClick(props.record.id)}
            >
                Delete
            </button>
        </div>
    );
}


export { ProfileActions };
