// управление redux

import {configureStore} from "@reduxjs/toolkit";
import {accountSlice} from "./accountSlice";

// создаем хранилище для хранения reducer и методов
export const store = configureStore({
    reducer: {
        account: accountSlice.reducer,
    },
});

// возвращаем стейт
export type RootState = ReturnType<typeof store.getState>;
// изменения стейта
export type AppDispatch = typeof store.dispatch;