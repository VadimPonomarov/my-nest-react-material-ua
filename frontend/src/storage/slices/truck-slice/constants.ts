import {IInitialState} from "./interfaces";

export const initialState: IInitialState = {
    trucks: [],
    checkedAll: false,
    checked: [],
    loading: false,
    error: null,
    refresh: false
}