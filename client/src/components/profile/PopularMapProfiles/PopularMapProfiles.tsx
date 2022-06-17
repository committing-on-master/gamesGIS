import React from 'react';
import { useFetchingData, withWaiter } from '../../../hocs/withWaiter';
import { PopularMapProfiles } from './../../../api/dto/response/PopularMapProfilesDTO';
import { ProfilesTable } from './ProfilesTable';
import { ProfilesTableProps } from './ProfilesTable/ProfilesTable';


const Table = withWaiter<ProfilesTableProps>(ProfilesTable);

function PopularMapProfiles() {
    const [state, message, response] = useFetchingData<PopularMapProfiles>('map-profiles/most-popular/5');
    const onClick = (profileName: string) => {

    }
    return (
        <Table 
            waiterSize='medium'
            waiterState={state}
            waiterMsg={message}


            // onClick={onClick}
            // profiles={response?.payload}
        />
    );
}

export { PopularMapProfiles };
