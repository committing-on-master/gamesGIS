import Table from 'rc-table';
import { ColumnsType } from 'rc-table/lib/interface';
import React from 'react';
import { ProfileInfo } from '../../../../api/dto/response/ProfileInfo';
import { MapType } from '../../../../api/dto/types/MapType';
import styles from './ProfilesTable.module.scss';

type RowType = ProfileInfo & { key: React.Key };

type ProfilesTableProps = {
    profiles: ProfileInfo[],
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
                return (MapType[value])
            }
        },
        {
            title: 'Author',
            dataIndex: 'author'
        },
        {
            title: 'View count',
            dataIndex: 'views'
        }
    ];

    const items = props.profiles
        .sort((first, second) => second.views - first.views)
        .map<RowType>((value, index) => {
            return {
                key: index + 1, ...value
            }
        });

    const onRowClick = (record: RowType | undefined) => { //, index: number | undefined, event: any) => {
        if (record) {
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
