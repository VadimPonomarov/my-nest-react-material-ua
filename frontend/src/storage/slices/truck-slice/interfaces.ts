export interface ITruck {
    id: number;
    watch: boolean;
    code?: string;
    name: string;
    stop?: string;
    tracing?: string;
    lat?: string;
    lng?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IInitialState {
    trucks: ITruck[];
    checkedAll: boolean;
    checked: number[];
    loading: boolean;
    error: string | null;
    refresh: boolean;
}