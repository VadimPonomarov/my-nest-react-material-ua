export interface IColumn {
    id: 'Show' | 'Info' | 'Name' | 'Lat' | 'Lng' | 'Code' | 'Tracing' | 'Modified' | 'Stop';
    label: string;
    minWidth?: number;
    align?: 'left' | 'right' | 'center';
}