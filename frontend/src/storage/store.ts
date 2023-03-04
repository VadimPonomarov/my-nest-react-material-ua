import {
    Action,
    combineReducers,
    configureStore,
    ThunkAction,
    getDefaultMiddleware,
} from '@reduxjs/toolkit';
import * as flatted from 'flatted';
import {persistReducer, createTransform} from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';
import storage from 'redux-persist/lib/storage';

import authSlice from "./slices/auth-slice/authSlice";
import directionsSlice from './slices/directions-slice/directionsSlice';
import drawerSlice from './slices/drawer-slice/drawerSlice';
import mapSlice from './slices/map-slice/mapSlice';
import markersSlice from './slices/marker-slice/markersSlice';
import truckSlice from "./slices/truck-slice/truckSlice";

const rootReducer = combineReducers({
    directions: directionsSlice,
    drawer: drawerSlice,
    markers: markersSlice,
    map: mapSlice,
    auth: authSlice,
    truck: truckSlice
});
const transformCircular = createTransform(
    (inboundState, key) => flatted.stringify(inboundState),
    (outboundState, key) => flatted.parse(outboundState),
)

const persistConfig = {
    key: 'root',
    storage,
    //blacklist: ['tracking']
    /* transforms: [transformCircular]*/
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
    devTools: process.env.NODE_ENV !== 'production',


});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
