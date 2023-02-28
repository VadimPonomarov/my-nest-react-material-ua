export interface IInitialState {
    isAuth: boolean;
    loading: boolean;
    error: string | null;
}

export interface IToken {
    type: string;
    token: string
}