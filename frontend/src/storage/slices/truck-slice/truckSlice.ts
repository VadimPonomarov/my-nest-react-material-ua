import {createAsyncThunk, createSlice, PayloadAction, Dispatch} from '@reduxjs/toolkit';

import {_axiosService} from '../../services';
import {initialState} from './constants';
import {ITruck} from './interfaces';

export const truckList = createAsyncThunk<ITruck[], undefined | null, { rejectValue: string }>(
    "truck/truckList",
    async (_, {rejectWithValue, dispatch}) => {
        const response = await _axiosService.getTruckList();
        if (response.status >= 400) return rejectWithValue('Error 👎');
        dispatch(setTruckList(response.data.result));
        return;
    });

const truckSlice = createSlice({
    name: 'truck',
    initialState,
    reducers: {
        setTruckList(state, action: PayloadAction<ITruck[]>) {
            try {
                action.payload.map(truck => {
                    const index = state.trucks.indexOf(truck);
                    if (index) {
                        return state.trucks[index] = truck;
                    } else {
                        return state.trucks.push(truck);
                    }
                });
                state.trucks = action.payload;
            } catch (e) {
                console.log(e)
            }
        },

        toggleRefresh(state) {
            try {
                state.refresh = !state.refresh;
            } catch (e) {
                console.log(e)
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(truckList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(truckList.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(truckList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
})

export const {setTruckList, toggleRefresh} = truckSlice.actions;
export default truckSlice.reducer;
