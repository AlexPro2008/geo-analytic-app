// путь для выполнения
// аутенфикация
import axios, {AxiosError, AxiosInstance, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig} from "axios";
import {useSelector} from "react-redux";
import {RootState} from "../redux/redux";
import {accountSlice} from "../redux/accountSlice";
// адрес хоста
const address:string = 'http://localhost:5076/api';

// базовый обьект для удобного использования
export const createAxios =
    (controller: string) => {
        const context = axios.create({baseURL: `${address}/${controller}`});
        context.interceptors.request.use(config => {
            // получаем данные
            const token = localStorage.getItem('token');
            if(token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            } // if
            return config;
        });
        return context;
} // createAxios

export const createAxiosExpress =
    (controller: string,token:string|null) => {
        const context = axios.create({baseURL: `${address}/${controller}`});
        context.interceptors.request.use(config => {
            if(token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            } // if
            return config;
        });
        return context;
    } // createAxios


// api узел для аутенфикации и авторизации

export const authNode = createAxios(`auth`);
// для мимолетного перехвата token
export const authNodeExpress =
    (token:string) => createAxiosExpress('auth',token);

// api узел для загрузки фотографии

export const photoNode = createAxios('photo');

// api узел вид деятельности компаний и работников

export const kindActivityNode = createAxios('kindActivity');

// api узел гео точки

export const companyPlaceNode = createAxios('companyPlace');

// api узел компании

export const companyNode = createAxios('company');

// api узел аналитики

export const analysisNode = createAxios('analysis');

// api узел поддержки

export const supportNode = createAxios('support');

// api узел админа

export const  adminNode = createAxios('admin');

// api узел задач

export const taskNode = createAxios('task');

// yandex map api suggest (future)
export const suggestNode =
    (address: string): Promise<AxiosResponse<{
        results: { title: { text: string }, subtitle?: { text: string } }[]
    }>> =>
        axios.create({baseURL:'https://suggest-maps.yandex.ru/v1'}).get(
            `/suggest?apikey=45f4fa10-a81e-4b23-8cfe-f73d9264cebd&text=${encodeURIComponent("Россия " + address)}&results=1&types=district,street,area,province`
        );