import axios from "axios";

import {ILoginInputs, IRegistrationInputs} from "../../interfaces";

const _baseUrl = process.env.REACT_APP_AXIOS_BASE_URL as string;
const _axios = axios.create({
    baseURL: _baseUrl,
    withCredentials: false
});

export const _accessToken = () => {
    return JSON.parse(localStorage.getItem('tokenPair')) ?
        JSON.parse(localStorage.getItem('tokenPair'))[0]['token'] :
        ''
}
export const _refreshToken = () => {
    return JSON.parse(localStorage.getItem('tokenPair')) ?
        JSON.parse(localStorage.getItem('tokenPair'))[1]['token'] :
        ''
}

_axios.interceptors.request.use((config) => {
    try {
        config.headers.Authorization = "Bearer " + _accessToken();
        return config;
    } catch (e) {
    }
}, (error) => {
    return Promise.reject(error);
});

_axios.interceptors.response.use((config) => {
    return config;
}, (error) => {
    const originalReq = error.config;
    try {
        _axiosService.getRefreshToken().then(res => localStorage.setItem('tokenPair', JSON.stringify(res.data.result)))
        return _axios.request(originalReq);
    } catch (e) {
        alert(e.message)
    }
});

export const _axiosService = {
    postLogin: (body: ILoginInputs) => _axios.post('/auth/login', body),
    postRegistration: (body: IRegistrationInputs) => _axios.post('/auth/registration', body),
    getTruckList: () => _axios.get('/truck'),
    getRefreshToken: () => _axios.post('/auth/refresh', {refreshToken: _refreshToken()}),
}

