// форма точки компании
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {analysisNode, suggestNode, companyNode, companyPlaceNode} from "../../../axios/path";
import {CompanyPlace} from "../../../models/interfaces/CompanyPlace";
import {TypeCompanyPlace, typeCompanyPlaceTo} from "../../../models/TypeCompanyPlace";
import {useQuery} from "@tanstack/react-query";
import {Formik, Form as FormikForm, Field, ErrorMessage, FormikHelpers, useFormik,
    FormikProvider} from "formik";
import * as Yup from "yup";
import {AxiosError, AxiosResponse} from "axios";
import {handleStatus} from "../../../httpStatusHandler/HttpStatusContext";
import {Alert, Button, Card, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import ErrorAlert from "../../alerts/ErrorAlert";
import LoadingAlert from "../../alerts/LoadingAlert";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router";
import ModalChoose from "./ModalChoose";
import {GeolocationControl, Map, Placemark, YMaps, ZoomControl} from "@pbe/react-yandex-maps";
import CompanyPlaces from "./CompanyPlaces";
import companyMap from "../map/CompanyMap";
import {ConvertPresetTypeCompanyPlace} from "../../../models/ConvertPresetTypeCompanyPlace";
import {Typeahead} from "react-bootstrap-typeahead";
const CompanyPlaceForm = () => {

    // ид предпринимателя
    const id = useSelector((e:RootState) => e.account
        .peopleId);


    // получаем ид
    const params = useParams();

    // получаем доп данные
    const [searchParams] = useSearchParams();


    // получаем данные ид точки
    let companyPlaceId = Number(params.id);

    // получаем откуда пришел
    const {from} = useParams();

    // получаем x и y
    const x = Number(searchParams.get("x") ?? 0);
    const y = Number(searchParams?.get("y") ?? 0);

    // получаем ид компании
    const companyId = Number(searchParams?.get("companyId") ?? 0);

    // хук для перенаправления
    const navigate = useNavigate();

    // состояния для отслеживания при отправление формы
    const [stateSubmit,setStateSubmit] = useState({color:"primary",text:"Сохранить"});

    // состояния для вызова alert
    const [showAlert,setShowAlert] = useState({show:false,text:""});

    // адрес
    const [addresses,setAddresses] = useState<{title:string,subtitle:string}[]>([]);


    // данные для просмотра если есть центр
    const { data:companies } = useQuery<any>({
        queryKey: ['company_places'],
        queryFn: async ():Promise<any> => {
            const response = await companyPlaceNode
                .get(`/get-company-places-by-enterpriser/${id}`)
                .catch();
            return response?.data;
        }
    });


    // запрашиваем заданные ид точки
    const { data:companyPlace, error:error, isLoading } = useQuery({
        queryKey: ['company_place'],
        queryFn: async ():Promise<CompanyPlace> => {
            const response = await companyPlaceNode
                .get(`/get-company-place-by-id/${companyPlaceId}`)
                .catch();

            return response.data;
        }
    });

    // запрашиваем компании заданного предпринимателя
    // производим запрос для просмотра всех компаний
    const {data:dataCompanies} = useQuery({
        queryKey:['companies'],
        queryFn: async():Promise<any> => {
            const response = await companyNode.get(`/get-all-default-by-id/${id}`)
                .catch();


            return response?.data;
        }
    });


    // отключения кнопки ввода если есть координаты
    const disable = ((companyPlace?.x !== 0
        && companyPlace?.y !== 0 && from !== "companyPlaces")) || (x !== 0 && y !== 0);

    // валидация
    // схема для валидации
    const validationScheme = Yup.object({
        name:Yup.string().required("Наименования точки обязательно"),
        area:Yup.number().required("Физическая площадь обязательна")
            .min(0,"Отрицательной площади нет"),
        placement:!disable ?
            Yup.string().required("Адрес обязателен")
            : Yup.string().notRequired()
    });



    // хук для обеспечения формы
    const formik = useFormik({
        initialValues: companyPlace ?? {
        id:0,
        isMain:false,
        description:"",
        name:"",
        area:0,
        companyId:companyId,
        placement:"",
        type:1,
        x:0,
        y:0
    },
        enableReinitialize: true,
        validationSchema: validationScheme,
        onSubmit: (values: CompanyPlace,
                   formikHelpers: FormikHelpers<CompanyPlace>) => {


            // устанавливаем в default
            setShowAlert({show: false,text:""});

            // устанавливаем состояния для оповещения пользователю
            setStateSubmit({color:"warning",text:"Отправка"});

            // если x и y есть
            if(x && y){
                 analysisNode.put('/update-recommendation',[x,y])
                     .then(console.log)
                     .catch(console.log);
            } // if

            // определяем путь
            // для определения обновления координат
            const path =
                (action:"add" | "update",) => disable
                    ? `/${action}-company-place-by-coords`
                : `/${action}-company-place-by-placement`;

            // проверка это обновление или добавление
            if(companyPlaceId === 0) {
                // при создании
                values.companyId = values.companyId === 0 ? dataCompanies[0].id : values.companyId;
                console.log(values);

                // отправление данных на сервер
                // когда успешно в это тело изменить состояния и перенаправления
                // когда с ошибкой то алерт
                // и вывод ошибки
                companyPlaceNode.post(path("add"), values)
                    .then(onSuccess).catch(onError);
            } else {
                companyPlaceNode.put(path("update"), values)
                    .then(onSuccess
                    ).catch(onError);
            } // if
        }});



    useEffect(() => {
             // если есть то
             if (x !== 0 && y !== 0) {
                 // формируем запрос
                 companyPlaceNode.post('/get-address-analysis', [x, y])
                     .then(e => {
                         formik.setFieldValue("x", x);
                         formik.setFieldValue("y", y);
                         formik.setFieldValue("placement", e.data);
                     }).catch(console.log);

             } // if

             // если есть параметр
             if (companyId) {
                 formik.setFieldValue("companyId", companyId);
             } // if
    }, [companyPlace?.id]);
    // если ошибка
    if(error) return <ErrorAlert name="Заданная компании точка не загрузилась"/>

    // загрузка
    if(isLoading) return <LoadingAlert name="Точка компании загружается" />

    // ф-н для отображения ошибок
    const onError = (e:AxiosError) => {
        // логирование
        console.error(e);
        // вызываем alert
        setShowAlert({show: true, text: handleStatus(e.status ?? 503).handle()});
        // установливаем заново
        setStateSubmit({color: "primary", text: "Сохранить"});
    };

    // ф-н если успешное исполнения
    const onSuccess = () => {
        // устанавливаем
        setStateSubmit({color: "success", text: "Успешно"});
        // ф-н что проделывает при успешном исполнение
        // переходим на страницу
        setTimeout(() =>
            navigate(`/${from}`),500);
    };

    // рендер компаний
    const companiesShow = dataCompanies?.map((item:any) => (<>
        <option value={item.id}>{item.name}</option>
    </>));

    // на закрытие
    const onClose = (e:any) => {
         // переход обратно на определенную страницу
         navigate(`/${from}`);
    };

    // определяет есть ли центр
    const isCenter = companies?.places?.find((e:any) =>
            e.isMain &&
        e.companyId ===  +formik.values.companyId);

    // если нет предприятия
    if(companyPlace?.companyId === 0) navigate('/companies');

    return (<>
            <h2 className="text-center">{companyPlaceId === 0 ? "Добавление"
                : "Редактирование"} точки компании</h2>

        <div className="p-4">
           <Card className="d-flex justify-content-center p-3 shadow mb-2">
                <FormikProvider value={formik}>
                        <Form onSubmit={formik.handleSubmit}>
                            <h5 className="fw-bold mb-3">Основная информация</h5>
                            <Row>
                                <Col xl={6} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Название точки</Form.Label>
                                        <Field
                                            name="name"
                                            type="text"
                                            as={Form.Control}
                                            placeholder="Например: Центральный склад"
                                            isInvalid={formik.touched.name && formik.errors.name}
                                        />
                                        <ErrorMessage name="name" component="div" className="text-danger small" />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Описание</Form.Label>
                                        <Field
                                            as="textarea"
                                            type="text"
                                            className="form-control"
                                            name="description"
                                            placeholder="Необязательно"
                                        />
                                        <Form.Text className="text-muted">
                                            Краткое описание назначения точки
                                        </Form.Text>
                                    </Form.Group>
                                </Col>

                                <Col xl={6} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Площадь (м²)</Form.Label>
                                        <Field
                                            type="number"
                                            as={Form.Control}
                                            name="area"
                                            placeholder="Например: 250"
                                            isInvalid={formik.touched.area && formik.errors.area}
                                        />
                                        <ErrorMessage name="area" component="div"
                                                      className="text-danger small" />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Тип точки</Form.Label>
                                        <Field as={Form.Select}
                                               name="type">
                                            <option value={1}>🏭 Склад</option>
                                            <option value={2}>🏪 Магазин</option>
                                            <option value={3}>🏢 Офис</option>
                                            <option value={4}>🏗 Фабрика</option>
                                        </Field>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr className="my-4" />

                            <h6 className="fw-bold mb-3">Привязка</h6>

                            <Form.Group className="mb-3">
                                <Field
                                    as={Form.Check}
                                    type="switch"
                                    disabled={isCenter !== undefined}
                                    name="isMain"
                                    label="Главная точка компании"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Компания</Form.Label>
                                <Field name="companyId" as={Form.Select}>
                                    {companiesShow}
                                </Field>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Адрес</Form.Label>


                                <Typeahead
                                    filterBy={() => true}
                                    onChange={(e) => {
                                        const obj:any = e[0];
                                        formik
                                        .setFieldValue('placement',obj?.label,true);
                                    }}
                                    onInputChange={async (text:string,event: ChangeEvent<HTMLInputElement, Element>) => {
                                        const {data} = await suggestNode(text)
                                            .catch();
                                        if(data.results) {
                                            await formik.setFieldValue('placement',text);
                                            setAddresses(data.results.map(e => {
                                                    const title = e.title.text;
                                                    const subtitle = e.subtitle?.text ?? "";
                                                    return {title: title, subtitle: subtitle}
                                                }
                                            ));
                                        } // if
                                    }}
                                    options={addresses.map(e =>
                                        ({value:e.title,
                                            label:`${e.title} ${e.subtitle}`}))}
                                    minLength={10}
                                    disabled={disable}
                                    placeholder="Введите адрес"
                                />
                                <ErrorMessage name="placement"
                                              component="div"
                                              className="text-danger small" />


                            </Form.Group>

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Button onClick={onClose} variant="outline-secondary">
                                    Закрыть
                                </Button>
                                <Button variant={stateSubmit.color} type="submit">
                                    {stateSubmit.text}
                                </Button>
                            </div>
                            { showAlert.show && <Alert className="mt-2 text-center"
                                                       variant="danger">{showAlert.text}</Alert>}
                        </Form>
                </FormikProvider>
           </Card>

        </div>
    </>);
};export default CompanyPlaceForm;