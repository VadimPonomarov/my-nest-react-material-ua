import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {initialState} from "./constants";
import {IToken} from "./interfaces";
import {ILoginInputs, IRegistrationInputs} from "../../../interfaces";
import {_axiosService} from '../../services'

export const login = createAsyncThunk<IToken, ILoginInputs, { rejectValue: string }>(
    "auth/login",
    async (body, {rejectWithValue, dispatch}) => {
        const response = await _axiosService.postLogin(body);
        if (response.status >= 400) return rejectWithValue('Error 👎');
        dispatch(setToken(response.data.result));
        return response.data.result;
    });
export const registration = createAsyncThunk<undefined, IRegistrationInputs, { rejectValue: string }>(
    "auth/registration",
    async (body, {rejectWithValue}) => {
        const response = await _axiosService.postLogin(body);
        if (response.status >= 400) return rejectWithValue('Error 👎');
    });

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearToken(state) {
            localStorage.removeItem('tokenPair');
        },
        toggleIsAuth(state) {
            state.isAuth = !state.isAuth;
        },
        setIsAuth(state, action: PayloadAction<boolean>) {
            state.isAuth = action.payload;
        },
        setToken(state, action: PayloadAction<IToken[]>) {
            localStorage.setItem('tokenPair', JSON.stringify(action.payload));
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isAuth = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })
            .addCase(registration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registration.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(registration.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })
    },
})


export const {clearToken, toggleIsAuth, setIsAuth, setToken} = authSlice.actions;
export default authSlice.reducer;
