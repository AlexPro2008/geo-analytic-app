import {createContext} from "react";
import {useDispatch, useSelector} from "react-redux";
import {install} from "./redux/accountSlice";
import {RootState} from "./redux/redux";
import axios from "axios";
import {Root} from "react-dom/client";

const context = createContext(null);
// глобальный контекст для обновления
const AuthProvider = ({children}:{children:any}) => {

    const {token} = useSelector((e:RootState) => e.account);
    // глобальное определение
    axios.interceptors.request.use(config => {
        const yandex = config.baseURL?.includes("yandex");
        if(token && !yandex) {
            config.headers["Authorization"] = `Bearer ${token}`;
        } // if
        return config;
    });

    return <context.Provider value={null}>
         {children}
    </context.Provider>
};

export default AuthProvider;