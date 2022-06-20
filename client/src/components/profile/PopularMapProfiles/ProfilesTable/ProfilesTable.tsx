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

function ProfilesTable({capacity = 5, ...props}: ProfilesTableProps) {
    const columns: ColumnsType<RowType> = [
        {
            title: ' ',
            dataIndex: 'key',
            className: styles.index
        },
        {
            title: 'Profile name',
            dataIndex: 'name',
            className: styles.name
        },
        {
            title: 'Map',
            dataIndex: 'type',
            className: styles.map,
            render: (value: MapType) => {
                if (value === MapType.Undefined) {
                    return '-';
                }
                return (MapType[value])
            }
        },
        {
            title: 'Author',
            dataIndex: 'author',
            className: styles.author
        },
        {
            title: 'View count',
            dataIndex: 'views',
            className: styles.count,
            render: (value: number) => (value !== 0) ? value : '-'
        }
    ];

    const onRowClick = (record: RowType) => {
        if (record && record.name !== '-') {
            props.onClick(record.name);
        }
    };

    const content = contentMapping(props.profiles, capacity);
    return (
        <Table
            className={styles.table}
            rowClassName={styles.row}
            rowKey={record => record.key}
            columns={columns}
            data={content}

            onRow={(row) => ({
                onClick: onRowClick.bind(null, row)
            })}
        />
    );
}

function contentMapping(profiles: ProfileInfo[], capacity: number): RowType[] {
    let result = profiles
        .sort((first, second) => second.views - first.views)
        .map<RowType>((value, index) => {
            return {
                key: index + 1, ...value
            }
        });
    if (result.length > capacity) {
        result = result.slice(0, capacity);
    } else {
        if (result.length < capacity) {
            for (let i = 0; i < capacity - profiles.length; i++) {
                result.push({
                    key: result.length + 1,
                    author: '-',
                    name: '-',
                    type: MapType.Undefined,
                    views: 0
                });
            }
        }
    }
    return result;
}

export { ProfilesTable };
