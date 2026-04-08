// Панель для обращения к помощи
// Храним
// Ид
// Email
// Тема
// Сообщения

import * as Yup from "yup";
import {ErrorMessage, Field, FormikHelpers, FormikProvider, useFormik} from "formik";
import {Task} from "../../../models/interfaces/Task";
import {supportNode, taskNode} from "../../../axios/path";
import ErrorAlert from "../../alerts/ErrorAlert";
import LoadingAlert from "../../alerts/LoadingAlert";
import {AxiosResponse} from "axios";
import {handleStatus} from "../../../httpStatusHandler/HttpStatusContext";
import {Alert, Button, Card, Form} from "react-bootstrap";
import {useState} from "react";
import {useNavigate, useSearchParams} from "react-router";
import {useQuery} from "@tanstack/react-query";

const BoardHelp = () => {

    // хук для навигации
    const navigate = useNavigate();

    // движок для поиска ид
    const [params] = useSearchParams();

    // обьект
    const support:{id:number,
        email:string,theme:string,description:string} =
        {id:0,email:"",theme:"",description:""};

    // стейт для отображения добавление изменения данных
    const [submit,setSubmit] = useState<{color:string,text:string}>({color:"primary",text:"Сохранить"});

    // стейт для отображения алерта
    const [showAlert,setShowAlert] = useState<{show:boolean,text:string}>({show:false,text:""});


    // хук для передачи формы
    // валидация
    // схема для валидации
    const validationScheme = Yup.object({

        email:Yup.string().required("Почта обязательно"),
        theme:Yup.string().required("Тема обязательно"),
        description:Yup.string().required("Описание обязательно"),

    });

    const formik = useFormik({
        initialValues: support,
        enableReinitialize: true,
        validationSchema: validationScheme,
        onSubmit: (values: {id:number
                       email:string,theme:string,description:string},
                   formikHelpers: FormikHelpers<{id:number,
                       email:string,theme:string,description:string}>) => {


            // устанавливаем в default
            setShowAlert({show: false,text:""});

            // устанавливаем состояния для оповещения пользователю
            setSubmit({color:"warning",text:"Отправка"});


            // отправление данных на сервер
            // когда успешно в это тело изменить состояния и перенаправления
            // когда с ошибкой то алерт
            // и вывод ошибки
            supportNode.post('/add-support', values)
                    .then(onSuccess).catch(onError);

        }});


    // ф-н для отображения ошибок
    const onError = (e:AxiosResponse) => {
        // логирование
        console.error(e);
        // вызываем alert
        setShowAlert({show: true, text: handleStatus(e.status ?? 503).handle()});
        // установливаем заново
        setSubmit({color: "primary", text: "Сохранить"});
    };

    // ф-н если успешное исполнения
    const onSuccess = () => {
        // устанавливаем
        setSubmit({color: "success", text: "Обращение успешно отправлено"});
        // перенаправление
        setTimeout(() => navigate('/'),700);
    };

    // на закрытие
    const onClose = () => {
        // переход обратно на главную страницу
        navigate("/")
    };
    return (<>
        <h2 className="text-center my-4">Форма обращения</h2>

        <div className="p-4">
            <Card className="d-flex justify-content-center p-3 shadow mb-2">
                <FormikProvider value={formik}>
                    <Form onSubmit={formik.handleSubmit}>


                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Тема</Form.Label>
                            <Field
                                name="theme"
                                type="text"
                                as={Form.Control}
                                placeholder="Проблема с входом"
                                isInvalid={formik.touched.theme
                                    && formik.errors.theme}
                            />
                            <ErrorMessage name="theme"
                                          component="div"
                                          className="text-danger small" />
                        </Form.Group>


                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Описание</Form.Label>
                            <Field
                                name="description"
                                type="text"
                                as="textarea"
                                className="form-control"
                                placeholder="Не могу войти или ошибка с токеном и т.д."
                                isInvalid={formik.touched.description && formik.errors.description}
                            />
                            <ErrorMessage name="description"
                                          component="div" className="text-danger small" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Email</Form.Label>
                            <Field
                                name="email"
                                type="text"
                                as={Form.Control}
                                placeholder="user@mail.ru"
                                isInvalid={formik.touched.email && formik.errors.email}
                            />
                            <ErrorMessage name="email"
                                          component="div"
                                          className="text-danger small" />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button onClick={onClose} variant="outline-secondary">
                                Закрыть
                            </Button>
                            <Button variant={submit.color} type="submit">
                                {submit.text}
                            </Button>
                        </div>
                        { showAlert.show && <Alert className="mt-2 text-center"
                                                   variant="danger">{showAlert.text}</Alert>}
                    </Form>
                </FormikProvider>
            </Card>
        </div></>);
};
export default BoardHelp;