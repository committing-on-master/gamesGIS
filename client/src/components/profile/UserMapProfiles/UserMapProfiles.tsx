import React, { useEffect, useState } from 'react';
import { MapProfileType, ProfilesDTO } from '../../../api/dto/response/ProfilesDTO';
import { useTable, Column } from "react-table";

import { RequestWrapper } from '../../../api/JsonRequestWrapper';
import { ErrorDTO } from '../../../api/dto/response/ErrorDTO';

import "./UserMapProfiles.scss";


const columns: ReadonlyArray<Column<MapProfileType>> = [
    {
        Header: "Profile Name",
        accessor: "name"
    },
    {
        Header: "Map",
        accessor: "map"
    },
    {
        Header: "Creation Date",
        accessor: "creationDate"
    },
    {
        Header: "Markers count",
        accessor: "markersCount"
    }
];

interface UserMapProfilesProps {
    userId: number;
}

function UserMapProfiles(props: UserMapProfilesProps) {
    const [profiles, setProfiles] = useState<MapProfileType[]>([]);
    useEffect(() => {
        RequestWrapper.endPoint(`map-profiles?userId=${props.userId}`).get().send<ProfilesDTO, ErrorDTO>()
            .then(res => {
                if (res.ok && res.success) {
                    setProfiles(res.success.payload);
                    return;
                }
                console.log(`code: ${res.code} - ${res.failure?.message}`);
            })
    }, [props.userId]);

    // const data = profiles.map((value) => {
    //     return {
    //         col1: value.name,
    //         col2: value.map.toString(),
    //         col3: value.creationDate.toString(),
    //         col4: value.markersCount
    //     }
    // })

    const tableInstance = useTable({
        columns: columns,
        data: profiles
    });
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance


    return (
        <div className="users-map-profiles">
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export { UserMapProfiles };
