import React, {useEffect, useState} from 'react';
import '../App.css';
import {Route, Routes, useLocation, useNavigate} from "react-router";
import MainLayout from "./entities/layouts/MainLayout";
import AppLayout from "./entities/layouts/AppLayout";
import Main from "./entities/main/Main";
import Registration from "./auth/Registration";
import Companies from "./entities/companies/Companies";
import {useDispatch, useSelector} from "react-redux";
import {authNode, authNodeExpress} from "../axios/path";
import {install} from "../redux/accountSlice";
import {Auth} from "../models/Auth";
import {Dispatch, UnknownAction} from "redux";
import axios, {AxiosError, AxiosResponse} from "axios";
import {RootState} from "../redux/redux";
import CompanyPlaces from "./entities/companyPlaces/CompanyPlaces";
import CompanyMap from "./entities/map/CompanyMap";
import CompanyPlaceForm from "./entities/companyPlaces/CompanyPlaceForm";
import Analysis from "./entities/analysis/Analysis";
import {Tab} from "react-bootstrap";
import Tasks from "./entities/task/Tasks";
import TaskForm from "./entities/task/TaskForm";
import CompanyForm from "./entities/companies/CompanyForm";
import Recommendation from "./entities/analysis/Recommendation";
import RecommendationAnalysis from "./entities/analysis/RecommendationAnalysis";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min"
import BoardHelp from "./entities/admin/BoardHelp";
import Verify from "./auth/Verify";
import PrepareResetPassword from "./auth/PrepareResetPassword";
import ResetPassword from "./auth/ResetPassword";
import Panel from "./entities/admin/Panel";
import Response from "./entities/admin/Response";
import useLocalStorage from "./useLocalStorage";
import KindActivityForm from "./entities/kindActivity/KindActivityForm";
import {jwtDecode} from "jwt-decode";
import {Root} from "react-dom/client";
import {StorageUser} from "../models/interfaces/StorageUser";
const App = () => {

    // глобальное определение
    const dispatch = useDispatch();
    dispatch(install());

    // возвращаем компонент вместе маршутизацией
    return <>
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<Main/>}></Route>
                <Route path="registration" element={<Registration/>}></Route>
                <Route path="admin" element={<BoardHelp/>}/>
                <Route path="verify/:id" element={<Verify/>}/>
                <Route path="prepareReset" element={<PrepareResetPassword/>}/>
                <Route path="resetPassword/:id"
                       element={<ResetPassword/>}/>
                <Route path="panel" element={<Panel/>}/>
                <Route path="response/:id/:status" element={<Response/>}/>
                <Route path="kindActivity/:id" element={<KindActivityForm/>}/>
                <Route path="profileAdmin/:id" element={<Registration/>}/>
            </Route>
            <Route element={<AppLayout/>}>
                <Route path="companies" element={<Companies/>}/>
                <Route path="tasks" element={<Tasks/>}/>
                <Route path="task" element={<TaskForm/>}/>
                <Route path="companyMapPlaces" element={<CompanyMap/>}/>
                <Route path="companyPlaces" element={<CompanyPlaces/>}/>
                <Route path="companyPlace/:id/:from" element={<CompanyPlaceForm/>}/>
                <Route path="analysis" element={<Analysis/>}/>
                <Route path="company" element={<CompanyForm/>}/>
                <Route path="recommendations" element={<RecommendationAnalysis/>}/>
                <Route path="profile/:id" element={<Registration/>}/>
            </Route>
        </Routes>
    </>;
};

export default App;
