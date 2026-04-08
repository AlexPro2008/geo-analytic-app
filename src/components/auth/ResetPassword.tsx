// Новый пароль

import {useState} from "react";
import * as Yup from "yup";
import {Formik, Form as FormikForm, Field, ErrorMessage, FormikHelpers, useFormik,
    FormikProvider} from "formik";
import {useNavigate, useParams} from "react-router";
import {authNode} from "../../axios/path";
import {AxiosResponse} from "axios";
import {handleStatus} from "../../httpStatusHandler/HttpStatusContext";
import {Alert, Button, Card, Form} from "react-bootstrap";

const ResetPassword = () => {

    // используем params
    const params = useParams();

    // получаем данные
    const {id} = params;

    // хук для перенаправления
    const navigate = useNavigate();

    // стейт для отображения добавление изменения данных
    const [submit,setSubmit] = useState<{color:string,text:string}>({color:"primary",text:"Отправить"});

    // стейт для отображения алерта
    const [showAlert,setShowAlert] = useState<{show:boolean,text:string}>({show:false,text:""});

    // стейт для отображения нового пароля
    const [showPassword,setShowPassword] = useState<boolean>(false);

    // хук для передачи формы
    // валидация
    // схема для валидации
    const validationScheme = Yup.object({
        password:Yup.string().required("Пароль обязателен")
            .min(8,"Минимальная длина 8 символов")
            .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                "Пример пароля - Abscad1245!")

    });

    const formik = useFormik({
        initialValues: {password:""},
        enableReinitialize: true,
        validationSchema: validationScheme,
        onSubmit: (values: {password:""},
                   formikHelpers: FormikHelpers<{password:""}>) => {


            // устанавливаем в default
            setShowAlert({show: false,text:""});

            // отправка данных для изменения пароля
            authNode.put('/reset-password',
                {id:Number(id ?? 0),passwordValue:values.password})
                .then(onSuccess)
                .catch(onError);
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
        setSubmit({color: "success", text: "Успешно обновлен"});
        // перенаправление на главную
        setTimeout(() => navigate('/'),500);
    };

    return (
        <>
            <h2 className="fw-semibold my-4 text-center">
                Подтверждение пароля
            </h2>

            <div className="d-flex justify-content-center">
                <Card className="shadow p-4" style={{ maxWidth: "420px", width: "100%" }}>

                    <FormikProvider value={formik}>
                        <Form onSubmit={formik.handleSubmit}>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Пароль</Form.Label>

                                <Field
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    as={Form.Control}
                                    placeholder="Введите пароль"
                                    isInvalid={formik.touched.password && formik.errors.password}
                                />

                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-danger small mt-1"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Check
                                    checked={showPassword}
                                    onChange={e => setShowPassword(e.target.checked)}
                                    type="switch"
                                    id="show-password"
                                    label="Показать пароль"
                                />
                            </Form.Group>

                            <div className="d-grid mt-3">
                                <Button variant={submit.color} type="submit">
                                    {submit.text}
                                </Button>
                            </div>

                            {showAlert.show && (
                                <Alert className="mt-3 text-center" variant="danger">
                                    {showAlert.text}
                                </Alert>
                            )}

                        </Form>
                    </FormikProvider>

                </Card>
            </div>
        </>
    );
};

export default ResetPassword;