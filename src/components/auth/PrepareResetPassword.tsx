// компонент для отображения сброса пароля
import {ErrorMessage, Field, FormikHelpers, FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import {Task} from "../../models/interfaces/Task";
import {authNode, taskNode} from "../../axios/path";
import {AxiosResponse} from "axios";
import {handleStatus} from "../../httpStatusHandler/HttpStatusContext";
import {useNavigate} from "react-router";
import {useState} from "react";
import {Alert, Button, Card, Form} from "react-bootstrap";

const PrepareResetPassword = () => {

    // хук для перенаправления
    const navigate = useNavigate();

    // стейт для отображения добавление изменения данных
    const [submit,setSubmit] = useState<{color:string,text:string}>({color:"primary",text:"Отправить"});

    // стейт для отображения алерта
    const [showAlert,setShowAlert] = useState<{show:boolean,text:string}>({show:false,text:""});

    // хук для передачи формы
    // валидация
    // схема для валидации
    const validationScheme = Yup.object({
          email:Yup.string().required("Почта обязательна")
              .email( "Почта должна соотвествовать формату name@mail.com")


    });

    const formik = useFormik({
        initialValues: {email:""},
        enableReinitialize: true,
        validationSchema: validationScheme,
        onSubmit: (values: {email:""},
                   formikHelpers: FormikHelpers<{email:""}>) => {


            // устанавливаем в default
            setShowAlert({show: false,text:""});

            // отправка данных для изменения пароля
            authNode.get(`/prepare-reset-password-cur-email/${values.email}`)
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
    const onSuccess = (e:AxiosResponse) => {
        // устанавливаем
        setSubmit({color: "success", text: "Успешно"});
        // ф-н что проделывает при успешном исполнение
        // переходим на страницу
        setTimeout(() =>
            navigate(`/verify/${e.data}?reset=true`),500);
    };

    return (
        <>
            <h2 className="fw-semibold my-4 text-center">
                Сброс пароля
            </h2>

            <div className="d-flex justify-content-center">
                <Card className="shadow p-4" style={{ maxWidth: "420px", width: "100%" }}>

                    <FormikProvider value={formik}>
                        <Form onSubmit={formik.handleSubmit}>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">
                                    Электронная почта
                                </Form.Label>

                                <Field
                                    name="email"
                                    type="email"
                                    as={Form.Control}
                                    placeholder="name@mail.com"
                                    isInvalid={formik.touched.email && formik.errors.email}
                                />

                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-danger small mt-1"
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
export default PrepareResetPassword;