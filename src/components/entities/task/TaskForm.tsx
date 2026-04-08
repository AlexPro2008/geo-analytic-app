// форма для создания или редактирования задачи
import {redirect, useLocation, useNavigate} from "react-router";
import {Formik, Form as FormikForm, Field, ErrorMessage, FormikHelpers, useFormik,
     FormikProvider} from "formik";
import {useQuery} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux";
import {taskNode} from "../../../axios/path";
import {Task} from "../../../models/interfaces/Task";
import * as Yup from "yup";
import {useState} from "react";
import {AxiosResponse} from "axios";
import {handleStatus} from "../../../httpStatusHandler/HttpStatusContext";
import {Alert, Button, Card, Form} from "react-bootstrap";
import ErrorAlert from "../../alerts/ErrorAlert";
import LoadingAlert from "../../alerts/LoadingAlert";

const TaskForm = () => {
     // используем локацию для просмотра ид
     const location = useLocation();
     // обращаемся к хранилищу за id
     const {peopleId} = useSelector((e:RootState)=> e.account);

     // хук для навигации
     const navigate = useNavigate();

     // ид
     const {id} = location.state;

     // стейт для отображения добавление изменения данных
     const [submit,setSubmit] = useState<{color:string,text:string}>({color:"primary",text:"Сохранить"});

     // стейт для отображения алерта
     const [showAlert,setShowAlert] = useState<{show:boolean,text:string}>({show:false,text:""});

     // хук для передачи
     const { data:task, error:error, isLoading } = useQuery({
          queryKey: ['task'],
          queryFn: async ():Promise<any> => {
               const response = await taskNode
                   .get(`/get-cur-task/${id}`)
                   .catch();
               return response.data;
          },
          staleTime:1000 * 60 * 5
     });


     // хук для передачи формы
     // валидация
     // схема для валидации
     const validationScheme = Yup.object({
            title:Yup.string().required("Заголовок обязателен"),
            target:Yup.string().required("Цель обязательна"),
            description:Yup.string().required("Описание обязательно")
     });

     const formik = useFormik({
          initialValues: task,
          enableReinitialize: true,
          validationSchema: validationScheme,
          onSubmit: (values: Task,
                     formikHelpers: FormikHelpers<Task>) => {


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
                    taskNode.post('/add-task', values)
                        .then(onSuccess).catch(onError);
               } else {
                    console.log(values);
                    taskNode.put('/update-task', values)
                        .then(onSuccess
                        ).catch(onError);
               } // if
          }});

     // если ошибка
     if(error) return <ErrorAlert name="Заданная задача не загрузилась"/>

     // загрузка
     if(isLoading) return <LoadingAlert name="Задача загружается" />

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
              navigate('/tasks'),500);
     };

     // на закрытие
     const onClose = () => {
          // переход обратно на главную страницу
          navigate("/tasks")
     };
     return (<>
          <h2 className="text-center mt-2">{id === 0 ? "Добавление"
              : "Редактирование"} задачи</h2>

          <div className="p-4">
               <Card className="d-flex justify-content-center p-3 shadow mb-2">
                    <FormikProvider value={formik}>
                         <Form onSubmit={formik.handleSubmit}>

                              <Form.Group className="mb-3">
                                   <Form.Label className="fw-semibold">Название задачи</Form.Label>
                                   <Field
                                       name="title"
                                       type="text"
                                       as={Form.Control}
                                       placeholder="Например: Расширение"
                                       isInvalid={formik.touched.title && formik.errors.title}
                                   />
                                   <ErrorMessage name="title"
                                                 component="div" className="text-danger small" />
                              </Form.Group>

                              <Form.Group className="mb-3">
                                   <Form.Label className="fw-semibold">Цель задачи</Form.Label>
                                   <Field
                                       name="target"
                                       type="text"
                                       as={Form.Control}
                                       placeholder="Например: Добавление новой точки для распределения"
                                       isInvalid={formik.touched.target && formik.errors.target}
                                   />
                                   <ErrorMessage name="target"
                                                 component="div" className="text-danger small" />
                              </Form.Group>

                              <Form.Group className="mb-3">
                                   <Form.Label className="fw-semibold">Описание </Form.Label>
                                   <Field
                                       name="description"
                                       type="text"
                                       as="textarea"
                                       className="form-control"
                                       placeholder="Например: Произвожу алгоритм действий"
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
} // TaskForm
export default TaskForm;