// компонент для верификации
import {useNavigate, useParams, useSearchParams} from "react-router";
import * as Yup from "yup";
import {ErrorMessage, Field, FormikHelpers, FormikProvider, useFormik} from "formik";
import {Task} from "../../models/interfaces/Task";
import {authNode, taskNode} from "../../axios/path";
import {Alert, Button, Card, Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import {handleStatus} from "../../httpStatusHandler/HttpStatusContext";
import {AxiosError, AxiosResponse} from "axios";
import VerificationInput from "react-verification-input";
import {boolean} from "yup";
import useLocalStorage from "../useLocalStorage";
import {useQuery} from "@tanstack/react-query";
import {useDispatch} from "react-redux";
import {setToken} from "../../redux/accountSlice";

const Verify = () => {

     // навигация
     const navigate = useNavigate();

     // dispatch
     const dispatch = useDispatch();

     // используем движок для получения параметров
     const [search] = useSearchParams();

     // получаем обьект
     const reset = search.get("reset");

     // стейт для отображения алерта
     const [showAlert,setShowAlert] = useState<{show:boolean,text:string}>({show:false,text:""});

     // попытки
     const [tryCount,setTryCount] = useState(5);


     // используем params
     const params = useParams();

     // ид
     const {id} = params;


     // установка с localstorage
     const [storage,setStorage] = useLocalStorage('token',"");

     // ф-н если успешное исполнения
     const onSuccess = (e:any) => {
         if(!reset) {
             // устанавливаем ключ в localstorage
           setStorage(e.data.jwt);
           dispatch(setToken(e.data.jwt));

          // ф-н что проделывает при успешном исполнение
          // переходим на страницу
          if(e.data.status === 1) {
             setTimeout(() => navigate('/panel'),500);
             return; // выходим из контекста
          } // if


          setTimeout(() =>
              navigate('/companyMapPlaces'),500);

         } else {
             // перенаправление
             setTimeout(() =>
                 navigate(`/resetPassword/${id}`),500);
         } // if

     };
     // ф-н для отображения ошибок
     const onError = (e:AxiosError<{message:string,attempts:number}>) => {
          // логирование
          console.error(e.message);

          // вызываем alert
          setShowAlert({show: true, text: handleStatus(e.status ?? 503).handle() + `.${e.response?.data.message ?? ""}`});
          setTryCount(e.response?.data.attempts ?? 0);
     };
     // возвращаем разметку
    return (
        <>
            <h2 className="my-4 fw-semibold text-center">
                Введите верификационный код, отправленный на вашу почту
            </h2>

            <div className="d-flex justify-content-center">
                <Card className="shadow p-4 text-center" style={{ maxWidth: "420px", width: "100%" }}>

                    <p className="text-muted mb-3">
                        Количества попыток: <span className="fw-semibold">{tryCount}</span>
                    </p>

                    <div className="d-flex justify-content-center mb-3">
                        <VerificationInput
                            length={6}
                            onComplete={(e) => {
                                const nextTry = tryCount - 1;
                                if(nextTry == 0) {
                                    setShowAlert({show:true,text:"Вы нарушили количества попыток"});
                                    setTimeout(() => navigate('/'),700);
                                    return;
                                } // if

                                authNode
                                    .get(`/verify/${+e}-${id}`)
                                    .then(onSuccess)
                                    .catch(onError);
                            }}
                        />
                    </div>

                    {showAlert.show && (
                        <Alert className="mt-2" variant="danger">
                            {showAlert.text}
                        </Alert>
                    )}

                </Card>
            </div>
        </>
    );
};

export default Verify;