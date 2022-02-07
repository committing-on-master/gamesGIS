import React from 'react';
import { MapProfileReviewType } from '../../../../api/dto/response/ProfilesDTO';
import { LinkButton } from '../../../common/LinkButton';

import "./ProfileActions.scss";

interface ProfileActionsProps {
    record: MapProfileReviewType;
    onDeletionClick(profileId: number): void;
}
function ProfileActions(props: ProfileActionsProps) {
    return (
        <div className='profile-actions'>
            <LinkButton className="button" to={`/map/${props.record.name}`}>Open map</LinkButton>
            <button
                className='button button--danger'
                onClick={() => props.onDeletionClick(props.record.id)}
            >
                Delete
            </button>
        </div>
    );
}


export { ProfileActions };
