export interface IColumn {
    id: 'Show' | 'Info' | 'Name' | 'Lat' | 'Lng' | 'Code' | 'Trace' | 'Modified';
    label: string;
    minWidth?: number;
    align?: 'left' | 'right' | 'center';
}