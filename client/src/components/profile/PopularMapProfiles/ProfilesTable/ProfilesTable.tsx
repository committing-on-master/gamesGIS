import Table from 'rc-table';
import { ColumnsType } from 'rc-table/lib/interface';
import React from 'react';
import { ProfileInfo } from '../../../../api/dto/response/PopularMapProfilesDTO';
import { MapType } from '../../../../api/dto/types/MapType';
import styles from './ProfilesTable.module.scss';

type RowType = ProfileInfo & { key: React.Key };

export type ProfilesTableProps = {
    profiles: ProfileInfo[],
    capacity: number,
    onClick: (profileName: string) => void
}

function ProfilesTable(props: ProfilesTableProps) {
    const columns: ColumnsType<RowType> = [
        {
            title: ' ',
            dataIndex: 'key'
        },
        {
            title: 'Profile name',
            dataIndex: 'name',
        },
        {
            title: 'Map',
            dataIndex: 'type',
            render: (value: MapType) => {
                if (value === MapType.Undefined) {
                    return '-';
                }
                return (MapType[value])
            }
        },
        {
            title: 'Author',
            dataIndex: 'author'
        },
        {
            title: 'View count',
            dataIndex: 'views',
            render: (value: number | undefined) => (value && value !== 0) ? value : '-'            
        }
    ];

    const items = props.profiles
        .sort((first, second) => second.views - first.views)
        .map<RowType>((value, index) => {
            return {
                key: index + 1, ...value
            }
        });

    items.push({
        key: 55,
        author: '-',
        name: '-',
        type: MapType.Undefined,
        views: 0
    });

    const onRowClick = (record: RowType | undefined) => { //, index: number | undefined, event: any) => {
        if (record && record.name) {
            props.onClick(record.name);
        }
    };

    return (
        <Table
            className={styles.table}
            rowClassName={styles.row}
            rowKey={record => record.key}
            columns={columns}
            data={items}

            onRow={(row) => ({
                onClick: onRowClick.bind(null, row)
            })}
        />
    );
}

export { ProfilesTable };
