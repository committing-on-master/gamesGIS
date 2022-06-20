import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchingData, withWaiter } from '../../../hocs/withWaiter';
import { PopularMapProfilesDTO } from './../../../api/dto/response/PopularMapProfilesDTO';
import { ProfilesTable } from './ProfilesTable';
import { ProfilesTableProps } from './ProfilesTable/ProfilesTable';


const Table = withWaiter<ProfilesTableProps>(ProfilesTable);

function PopularMapProfiles() {
    const [state, message, response] = useFetchingData<PopularMapProfilesDTO>('map-profiles/most-popular/5');
    const navigate = useNavigate();
    
    const onClick = (profileName: string) => {
        navigate(`../map/${profileName}`);
    }
    return (
        <Table 
            waiterSize='medium'
            waiterState={state}
            waiterMsg={message}

            onClick={onClick}
            profiles={response?.payload}
        />
    );
}

export { PopularMapProfiles };
