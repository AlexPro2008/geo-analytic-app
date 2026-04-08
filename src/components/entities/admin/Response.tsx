// форма для ответа
import {useNavigate, useParams} from "react-router";
import * as Yup from "yup";
import {ErrorMessage, Field, FormikHelpers, FormikProvider, useFormik} from "formik";
import {supportNode} from "../../../axios/path";
import {handleStatus} from "../../../httpStatusHandler/HttpStatusContext";
import {useState} from "react";
import {AxiosResponse} from "axios";
import {Alert, Button, Card, Form} from "react-bootstrap";
import {StatusResult} from "../../../models/enums/StatusResult";

const Response = () => {

     // получаем данные
     const params = useParams();

     // хук для навигации
     const navigate = useNavigate();

     // ид обращения
     const {id} = params;

     // статус
     const status:StatusResult = Number(params.status ?? 0);

    // стейт для отображения добавление изменения данных
    const [submit,setSubmit] = useState<{color:string,text:string}>({color:"primary",text:"Сохранить"});

    // стейт для отображения алерта
    const [showAlert,setShowAlert] = useState<{show:boolean,text:string}>({show:false,text:""});

    // хук для передачи формы
    // валидация
    // схема для валидации
    const validationScheme = Yup.object({
        description:Yup.string().required("Описание обязательно")
            .min(10,"Минимальная длина 10 символов"),
    });


    // формик
    const formik = useFormik({
        initialValues: {description:""},
        enableReinitialize: true,
        validationSchema: validationScheme,
        onSubmit: (values: {description:string},
                   formikHelpers: FormikHelpers<{description:string}>) => {


            // устанавливаем состояния для оповещения пользователю
            setSubmit({color:"outline-warning",text:"Отправка"});
            // отправка
            setSubmit({color:'outline-warning',text:'Отправка..'});
            // отправка данных
            supportNode.put('/response',{id: Number(id),
                description:values.description,status:status})
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
        setSubmit({color: "success", text: "Успешно"});
        // ф-н что проделывает при успешном исполнение
        // переходим на страницу
        setTimeout(() =>
            navigate('/panel'),500);
    };

    // на закрытие
    const onClose = () => {
        // переход обратно на главную страницу
        navigate("/panel")
    };
    return (<>
        <h2 className="text-center">{status === StatusResult.Accept ? "Формирование ответа" : "Сформируйте причину отказа поддержки"}</h2>

        <div className="p-4">
            <Card className="d-flex justify-content-center p-3 shadow mb-2">
                <FormikProvider value={formik}>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Ответ</Form.Label>
                            <Field
                                name="description"
                                type="text"
                                as="textarea"
                                className="form-control"
                                placeholder="Сформируйте ответ"
                                isInvalid={formik.touched.description && formik.errors.description}
                            />
                            <ErrorMessage name="description"
                                          component="div" className="text-danger small" />

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
        </div>
    </>);

};
export default Response;