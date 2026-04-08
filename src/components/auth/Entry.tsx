// Аутенфикация и авторизация предпринимателя

import {SubmitEventHandler, useState, useSyncExternalStore} from "react";
import {Auth} from "../../models/Auth";
import {Alert, Button, Card, Container, Form} from "react-bootstrap";
import {Formik, Form as FormikForm, Field, ErrorMessage, FormikHelpers} from "formik";
import * as Yup from "yup";
import {authNode} from "../../axios/path";
import {handleStatus, HttpStatusContext} from "../../httpStatusHandler/HttpStatusContext";
import {AxiosError, AxiosResponse} from "axios";
import {NavLink, useNavigate} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import { setUserId} from "../../redux/accountSlice";
import {RootState} from "../../redux/redux";
import useLocalStorage from "../useLocalStorage";


const Entry = () => {

     // хранения логинов и паролей
     const auth:Auth = {username:"",password:""};

     // направление
     const navigate = useNavigate();

     // состояния для отслеживания при отправление формы
     const [stateSubmit,setStateSubmit] = useState({color:"primary",text:"Войти"});

     // состояния для вызова alert
     const [showAlert,setShowAlert] = useState({show:false,text:""});

     // состояния отображения пароля
     const [showPassword,setShowPassword] = useState<boolean>();


     // схема для валидации
     const validationScheme = Yup.object({
           username:Yup.string().required("Логин или почта обязательно")
               .matches(
                   /^([a-zA-Z0-9_]{3,20}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                   "Введите логин или email"
               ),
           password:Yup.string().required("Пароль обязателен")
     });


     // обработка данных и их отправление
     const onSubmit = (values: Auth, formikHelpers: FormikHelpers<Auth>) => {

            // устанавливаем в default
            setShowAlert({show: false,text:""});

            // устанавливаем состояния для оповещения пользователю
            setStateSubmit({color:"warning",text:"Отправка"});

            // отправка
            authNode.get(`/login/${values.username}-${values.password}`)
                .then((e) => {


                     // устанавливаем
                     setStateSubmit({color:"success",text:"Успешно"});


                     // перенаправление
                     navigate(`/verify/${e.data}`);


                }).catch((e:AxiosResponse) => {
                      // логирование
                      console.error(e);
                      // вызываем alert
                      setShowAlert({show: true,text:handleStatus(e.status ?? 503).handle()});
                      // устанавливаем заново
                      setStateSubmit({color:"primary",text:"Войти"})
            });
     } // onSubmit


     // возвращение разметки
     return (<>
      <div className="d-flex justify-content-center align-items-center vh-100">
         <Card title="Вход в систему" className="p-4 w-75 shadow-sm" >
             <h4 className="text-center fw-semibold mb-1">Вход в систему</h4>
             <p className="text-center text-muted small mb-4">
                 Авторизация в GeoAnalytics Platform
             </p>


             <Formik validationSchema={validationScheme}
                       initialValues={auth} onSubmit={onSubmit}>
                    {({ handleSubmit, touched, errors }) => (
                        <FormikForm onSubmit={handleSubmit}>
                             <Form.Group className="mb-3">
                                  <Form.Label>Логин или почта</Form.Label>
                                  <Field name="username"
                                         type="text"
                                         as={Form.Control}
                                         isInvalid={touched.username && errors.username}
                                         />
                                  <ErrorMessage name="username"
                                                component="div"
                                                className="text-danger"/>
                             </Form.Group>

                             <Form.Group className="mb-3">
                                  <Form.Label >Пароль</Form.Label>
                                  <Field as={Form.Control} name="password" type={showPassword ? "text" : "password"}
                                         />
                                  <ErrorMessage name="password" component="div"
                                                className="text-danger"/>
                             </Form.Group>

                            <Form.Group className="mb-3">
                             <Form.Check checked={showPassword}
                                         onChange={e => setShowPassword(e.target.checked)}
                                         type="switch"
                                         id="custom-switch"
                                         label="Показать пароль"></Form.Check>
                            </Form.Group>
                            <div className="d-grid">
                             <Button variant={stateSubmit.color} type="submit">{stateSubmit.text}</Button>
                            </div>

                            <p className="text-center text-muted small mt-3 mb-0">
                                Нет доступа? Обратитесь к <NavLink to="/admin"
                                                                   style={{textDecoration:"none"}}
                                                                   className="link-info">администратору системы</NavLink> или <NavLink to="/prepareReset" style={{textDecoration:"none"}} className="link-info">сбросьте пароль</NavLink>
                            </p>

                            <p className="text-center text-muted small mt-2 mb-0">
                                <NavLink style={{textDecoration:"none"}} className="link-info"
                                         to="/registration">Зарегистрироваться</NavLink>

                            </p>
                        </FormikForm>

                    )}

               </Formik>
             {
                 showAlert.show && <Alert className="mt-2 text-center" variant="danger">
                     {showAlert.text}
                 </Alert>
             }
          </Card>
      </div>
     </>);
} // Entry
export default Entry;