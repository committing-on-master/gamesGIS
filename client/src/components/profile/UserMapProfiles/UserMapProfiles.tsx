import React, { useEffect, useState } from 'react';
import { MapProfileReviewType, MapProfilesReviewDTO } from '../../../api/dto/response/ProfilesDTO';
import Table from 'rc-table';

import { RequestWrapper } from '../../../api/JsonRequestWrapper';
import { ErrorDTO } from '../../../api/dto/response/ErrorDTO';

import styles from './UserMapProfiles.module.scss';
import { MapType } from '../../../api/dto/types/MapType';
import { ColumnsType, RenderExpandIconProps } from 'rc-table/lib/interface';
import { ProfileActions } from './ProfileActions';

type RowType = MapProfileReviewType & { key: React.Key };

interface UserMapProfilesProps {
    userId: number;
}

function UserMapProfiles(props: UserMapProfilesProps) {
    const [profiles, setProfiles] = useState<RowType[]>([]);
    const [filtered, NameFilter, SelectFilter] = useFilterHook(profiles);

    useEffect(() => {
        RequestWrapper.endPoint(`map-profiles/review?userId=${props.userId}`).get().send<MapProfilesReviewDTO, ErrorDTO>()
            .then(res => {
                if (res.ok && res.success) {
                    const keyed: RowType[] = res.success.payload.map((value) => {
                        return {
                            key: value.id,
                            ...value
                        };
                    });
                    setProfiles(keyed);
                    return;
                }
                console.log(`code: ${res.code} - ${res.failure?.message}`);
            })
    }, [props.userId]);

    const columns: ColumnsType<MapProfileReviewType> = [
        {
            // title: "Profile Name",
            title: NameFilter,
            dataIndex: "name",
        },
        {
            // title: "Map",
            title: SelectFilter,
            dataIndex: "map",
            render: (value: MapType) => {
                return (MapType[value])
            }
        },
        {
            title: "Creation Date",
            dataIndex: "creationDate"
        },
        {
            title: "Markers count",
            dataIndex: "markersCount"
        }
    ];

    const handleDeleteEvent = (profileId: number) => {
        RequestWrapper.endPoint(`map-profiles/${profileId}`).withAuth().delete().send()
            .then(res => {
                if (res.ok) {
                    const updated = profiles.filter((value) => value.id !== profileId);
                    setProfiles(updated);
                }
            })
    }

    return (
        <Table
            className={styles.table}
            rowClassName={styles.row}
            rowKey={record => record.id}
            columns={columns}
            data={filtered}
            // scroll={{
            //     y: 250
            // }}
            expandable={{
                expandRowByClick: true,
                expandedRowRender: record =>
                    <ProfileActions
                        record={record}
                        onDeletionClick={handleDeleteEvent}
                    />,
                onExpand: (expanded, record) => {

                },
                expandedRowClassName: () => styles.rowExpanded,
                expandIcon: CustomExpandIcon,
            }}
        />
    );
}

function CustomExpandIcon(props: RenderExpandIconProps<MapProfileReviewType>) {
    const text = props.expanded ? '⇧' : '⇩';

    return (
        <span
            className={styles.icon}
            onClick={e => {
                props.onExpand(props.record, e);
            }}
        >
            {text}
        </span>
    );
}

function useFilterHook(mapProfiles: MapProfileReviewType[]): [MapProfileReviewType[], JSX.Element, JSX.Element] {
    const [nameFilter, setNameFilter] = useState("");
    const [mapFilter, setMapFilter] = useState(MapType.Undefined);

    const NameInput = <input
        className={styles.nameFilter}
        type={"text"}
        placeholder={"Name filter"}
        value={nameFilter}
        onChange={(e) => {
            setNameFilter(e.target.value)
        }}
    />

    const SelectFilter =
        <select
            className={styles.mapFilter}
            value={mapFilter}
            onChange={(e) => {
                setMapFilter(Number(e.target.value));
            }
            }>
            {Object.keys(MapType)
                .filter((value) => Number.isNaN(Number(value)))
                .map((key, index) => (
                    <option key={index} value={index}>
                        {key === MapType[0].toString() ? "Map filter" : key}
                    </option>
                ))}
        </select>;

    let filtered = mapProfiles;
    if (mapFilter) {
        filtered = filtered.filter((value) => value.map === mapFilter);
    }

    if (nameFilter !== "") {
        filtered = mapProfiles.filter((value) => value.name.toLowerCase().includes(nameFilter?.toLowerCase()));
    }

    return [filtered, NameInput, SelectFilter];
}

export { UserMapProfiles };
