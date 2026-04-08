// компонент для отображения формы компании
import {useLocation, useNavigate} from "react-router";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {companyNode, kindActivityNode, taskNode} from "../../../axios/path";
import {Formik, Form as FormikForm, Field, ErrorMessage, FormikHelpers, useFormik,
    FormikProvider} from "formik";
import * as Yup from "yup";
import {Company} from "../../../models/interfaces/Company";
import {Task} from "../../../models/interfaces/Task";
import {AxiosResponse} from "axios";
import {handleStatus} from "../../../httpStatusHandler/HttpStatusContext";
import {Alert, Button, Card, Form, OverlayTrigger, Tooltip} from "react-bootstrap";
import LoadingAlert from "../../alerts/LoadingAlert";
import ErrorAlert from "../../alerts/ErrorAlert";
import {convertTypeKindActivity, TypeKindActivity} from "../../../models/enums/TypeKindActivity";

const CompanyForm = () => {

    // данные передаются через useLocation
    const location = useLocation();

    // используем redux
    const {peopleId} = useSelector((e:RootState) => e.account);

    // хук для навигации
    const navigate = useNavigate();

    // если undefined локация
    if(!location.state) {
        navigate('/companies');
    } // if

    // ид
    const {id} = location.state;

    // стейт для отображения добавление изменения данных
    const [submit,setSubmit] = useState<{color:string,text:string}>({color:"primary",text:"Сохранить"});

    // стейт для отображения алерта
    const [showAlert,setShowAlert] = useState<{show:boolean,text:string}>({show:false,text:""});

    // хук для передачи
    const { data:kindActivities } = useQuery({
        queryKey: ['kind_activities'],
        queryFn: async ():Promise<any[]> => {
            const response = await kindActivityNode
                .get(`/get-kind-activities-for-companies`)
                .catch();
            return response.data;
        }
    });

    // хук для передачи компании
    const {data:company,isError,isLoading}=useQuery({
          queryKey:['company'],
          queryFn: async():Promise<any> => {
               const response = await companyNode
                      .get(`/get-company-by-id/${id}`)
               return response.data;
          }
    })
    // хук для передачи формы
    // валидация
    // схема для валидации
    const validationScheme = Yup.object({
        name:Yup.string().required("Наименование компании обязательно"),
        description:Yup.string().required("Описание обязательно")
    });


    // хук для формы
    const formik = useFormik({
        initialValues: company,
        enableReinitialize: true,
        validationSchema: validationScheme,
        onSubmit: (values: Company,
                   formikHelpers: FormikHelpers<Company>) => {


            // устанавливаем в default
            setShowAlert({show: false,text:""});

            // устанавливаем состояния для оповещения пользователю
            setSubmit({color:"warning",text:"Отправка"});

            // проверка это обновление или добавление
            if(id === 0) {
                // при создании
                values.peopleId = values.peopleId === 0
                    ? peopleId : values.peopleId;
                console.log(values);
                // отправление данных на сервер
                // когда успешно в это тело изменить состояния и перенаправления
                // когда с ошибкой то алерт
                // и вывод ошибки
                companyNode.post('/add-company', values)
                    .then(onSuccess).catch(onError);
            } else {
                console.log(values);
                companyNode.put('/update-company', values)
                    .then(onSuccess
                    ).catch(onError);
            } // if
        }});

    // ошибка
    if(isError) return <ErrorAlert name="Ошибка компания не загрузилась"/>

    // проверка
    if(isLoading) return <LoadingAlert name="Компания загружается"/>


    // ф-н если успешное исполнения
    const onSuccess = () => {
        // устанавливаем
        setSubmit({color: "success", text: "Успешно"});
        // ф-н что проделывает при успешном исполнение
        // переходим на страницу
        setTimeout(() =>
            navigate('/companies'),500);
    };

    // на закрытие
    const onClose = () => {
        // переход обратно на главную страницу
        navigate("/companies")
    };

    // ф-н для отображения ошибок
    const onError = (e:AxiosResponse) => {
        // логирование
        console.error(e);
        // вызываем alert
        setShowAlert({show: true, text: handleStatus(e.status ?? 503).handle()});
        // установливаем заново
        setSubmit({color: "primary", text: "Сохранить"});
    };

    // отображения вида деятельности
    const kindActivitiesRender =
         kindActivities?.map(e =>
              <option value={e.id}>{e.kindActivity} , <p className="fw-bold">{convertTypeKindActivity(e.type)}</p></option>);

    return (<>
        <h2 className="text-center">{id === 0 ? "Добавление"
            : "Редактирование"} компании</h2>

        <div className="p-4">
            <Card className="d-flex justify-content-center p-3 shadow mb-2">
                <FormikProvider value={formik}>
                    <Form onSubmit={formik.handleSubmit}>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Название компании</Form.Label>
                            <Field
                                name="name"
                                type="text"
                                as={Form.Control}
                                placeholder="Предприятия номер 1"
                                isInvalid={formik.touched.name && formik.errors.name}
                            />
                            <ErrorMessage name="name"
                                          component="div" className="text-danger small" />
                        </Form.Group>


                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Описание </Form.Label>
                            <Field
                                name="description"
                                type="text"
                                as="textarea"
                                className="form-control"
                                placeholder="Производство или аренда точек и так далее"
                                isInvalid={formik.touched.description && formik.errors.description}
                            />
                            <ErrorMessage name="description"
                                          component="div" className="text-danger small" />
                        </Form.Group>


                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Вид деятельности</Form.Label>

                                <Field as={Form.Select}
                                       name="kindActivityId">
                                    {kindActivitiesRender}
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
        </div></>);
};
export default CompanyForm;


