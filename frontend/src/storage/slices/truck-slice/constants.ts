import { IInitialState } from "./interfaces";

export const initialState: IInitialState = {
    trucks: [],
    checkedAll: true,
    checked: [],
    loading: false,
    error: null,
    refresh: false
}