import {useNavigate, useParams} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {kindActivityNode, taskNode} from "../../../axios/path";
import LoadingAlert from "../../alerts/LoadingAlert";
import ErrorAlert from "../../alerts/ErrorAlert";
import {Alert, Button, Card, Form} from "react-bootstrap";
import * as Yup from "yup";import {Formik, Form as FormikForm, Field, ErrorMessage, FormikHelpers, useFormik,
    FormikProvider} from "formik";
import {Task} from "../../../models/interfaces/Task";
import {AxiosResponse} from "axios";
import {handleStatus} from "../../../httpStatusHandler/HttpStatusContext";
import {convertTypeKindActivity, mapKindActivityArray, TypeKindActivity} from "../../../models/enums/TypeKindActivity";
import {useState} from "react";

const KindActivityForm = () => {

     // получаем параметры
     const params = useParams();

     // ид
     const id = Number(params.id);

     // хук навигации
     const navigate = useNavigate();

    // стейт для отображения добавление изменения данных
    const [submit,setSubmit] = useState<{color:string,text:string}>({color:"primary",text:"Сохранить"});

    // стейт для отображения алерта
    const [showAlert,setShowAlert] = useState<{show:boolean,text:string}>({show:false,text:""});


    // хук
     const {data,isLoading,isError} = useQuery({
         queryKey: ["kind_activity"],
         queryFn:async ():Promise<{id:number,kindActivity:string,type:TypeKindActivity}> => {
              const {data} = await kindActivityNode.get(`/get-cur-kind-activity-by-id/${id}`).catch();
              return data;
         }
     });


    // валидация
    // схема для валидации
    const validationScheme = Yup.object({
            kindActivity:Yup.string().required("Наименования вида деятельности обязательно"),
    });

    const formik = useFormik({
        initialValues: data ?? {id:0,kindActivity:"",type:1},
        enableReinitialize: true,
        validationSchema: validationScheme,
        onSubmit: (values: {id:number,kindActivity:string,type:TypeKindActivity},
                   formikHelpers: FormikHelpers<{id:number,kindActivity:string,type:TypeKindActivity}>) => {


            // устанавливаем в default
            setShowAlert({show: false,text:""});

            // устанавливаем состояния для оповещения пользователю
            setSubmit({color:"warning",text:"Отправка"});

            // проверка это обновление или добавление
            if(id === 0) {
                // отправление данных на сервер
                // когда успешно в это тело изменить состояния и перенаправления
                // когда с ошибкой то алерт
                // и вывод ошибки
                kindActivityNode.post('/add-kind-activity', values)
                    .then(onSuccess).catch(onError);
            } else {
                console.log(values);
                kindActivityNode.put('/update-kind-activity', values)
                    .then(onSuccess
                    ).catch(onError);
            } // if
        }});



    // если ошибка
     if(isError) return <ErrorAlert name="Произошла ошибка при загрузке"/>

     // если загрузка
     if(isLoading) return <LoadingAlert name="Вид деятельности загружается"/>




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
        navigate("/panel");
    };
    return (<>
        <h2 className="text-center my-2">{id === 0 ? "Добавление"
            : "Редактирование"} вида деятельности</h2>

        <div className="p-4">
            <Card className="d-flex justify-content-center p-3 shadow mb-2">
                <FormikProvider value={formik}>
                    <Form onSubmit={formik.handleSubmit}>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Название вида деятельности</Form.Label>
                            <Field
                                name="kindActivity"
                                type="text"
                                as={Form.Control}
                                placeholder="Промышленная торговля"
                                isInvalid={formik.touched.kindActivity && formik.errors.kindActivity}
                            />
                            <ErrorMessage name="kindActivity"
                                          component="div" className="text-danger small" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Тип точки</Form.Label>
                            <Field as={Form.Select}
                                   name="type">
                                {mapKindActivityArray().map((e,index) =>
                                  <option key={index} value={e.type}>{e.explain}</option>)}
                            </Field>
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

export default KindActivityForm;