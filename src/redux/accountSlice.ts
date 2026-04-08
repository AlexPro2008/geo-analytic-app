import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import {StorageUser} from "../models/interfaces/StorageUser";
import {authNode, authNodeExpress} from "../axios/path";
import {StatusEnter} from "../models/enums/StatusEnter";
// базовый стейт инициализации redux
const initialState: StorageUser = {
      peopleId:0,
      token:""
};
export const accountSlice  = createSlice({
    name: 'storageUser',
    initialState,
    reducers: {
        install: (state) => {
            if(state.token === '') {
                state.token = localStorage.getItem('token')
                    ?? "";
            } // if

            // claims
            const payload = state.token.split('.')[1];
            const parse = JSON.parse(atob(payload));
            const getUserId = parse?.userId ?? 0;
            state.peopleId = getUserId;
        },
        setUserId: (state, action:PayloadAction<number>) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.peopleId = action.payload;
        },
        setToken(state,action:PayloadAction<string>) {
            state.token = action.payload;
        }
    },
});

// Action creators are generated for each case reducer function
export const { setUserId,setToken,install } = accountSlice.actions;

export default accountSlice.reducer;