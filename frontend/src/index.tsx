import React from 'react';

import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {BrowserRouter} from "react-router-dom";
import {PersistGate} from 'redux-persist/integration/react';

import App from './App';
import {persistor, store} from './storage';

import './index.css';


const container = document.getElementById('root')!;
const root = createRoot(container);


root.render(
    <BrowserRouter>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                    <App/>
            </PersistGate>
        </Provider>
    </BrowserRouter>
);
