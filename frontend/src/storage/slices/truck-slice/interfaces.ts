export interface ITruck {
    id: number;
    inactive: boolean;
    code: string;
    name: string;
    tracing: boolean;
    lat: string;
    lng: string;
    createdAt: string;
    updatedAt: string;
}

export interface IInitialState {
    trucks: ITruck[];
    loading: boolean;
    error: string | null;
    refresh: boolean;
}