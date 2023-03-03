import { IColumn } from "..";

export const columns: IColumn[] = [
    {id: 'Show', label: 'Show', minWidth: 10, align: 'center'},
    {id: 'Info', label: 'Info', minWidth: 10, align: 'center'},
    {id: 'Stop', label: 'Stop', minWidth: 10, align: 'center'},
    {id: 'Tracing', label: 'Tracing', minWidth: 10, align: 'center'},
    {id: 'Name', label: 'Name', minWidth: 300, align: 'left'},
];

export const config = {
    initialWidth: 500
}