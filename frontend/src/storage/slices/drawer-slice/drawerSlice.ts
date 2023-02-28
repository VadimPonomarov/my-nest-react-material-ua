import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {IDrawerState} from './interfaces';

const initialState: IDrawerState = {
    drawer: {
        title: 'MyDrawer',
        isOpened: false,
        width: '400px'
    }
};

const drawerSlice = createSlice({
    name: 'drawer',
    initialState,
    reducers: {
        changeDrawer(state, action: PayloadAction<Partial<IDrawerState>>) {
            state.drawer = {...state.drawer, ...action.payload.drawer};
        },

    }
});

export const {changeDrawer} = drawerSlice.actions;
export default drawerSlice.reducer;

