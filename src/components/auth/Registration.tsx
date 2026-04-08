// Регистрация предпринимателя
import {People, PeopleSend} from "../../models/interfaces/People";
import {Formik, Form as FormikForm, Field, ErrorMessage, FormikHelpers, useFormik, FormikProvider} from "formik";
import * as Yup from "yup";
import {
    Alert,
    Button,
    Card,
    Col,
    DropdownDivider,
    Form,
    FormGroup,
    FormLabel,
    Image,
    InputGroup,
    Row
} from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";
import {Auth} from "../../models/Auth";
import {ChangeEvent, useState} from "react";
import {authNode, authNodeExpress, photoNode} from "../../axios/path";
import {handleStatus} from "../../httpStatusHandler/HttpStatusContext";
import {useLocation, useNavigate, useParams} from "react-router";
import {AxiosResponse} from "axios";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/redux";
import {useQuery} from "@tanstack/react-query";
import LoadingAlert from "../alerts/LoadingAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import {setUserId} from "../../redux/accountSlice";
import {Task} from "../../models/interfaces/Task";


const Registration = () => {

      // получаем ид
      const params = useParams();
      const peopleId = Number(params.id ?? 0);

      // токен извлекаем
      const {token} = useSelector((e:RootState) => e.account);

      // предприниматель
      const [people,setPeople] = useState<People>({id:0,surname:"",
          name:"",patronymic:"",
          number:"",passport:"",path:"base.png",
          gender:0,username:"",password:"",email:""});

      // перенаправление
      const redirect = useNavigate();

      // состояния отображения пароля
      const [showPassword,setShowPassword] = useState<boolean>();

      // состояния для отображения отправления файла на сервер
      const [sendFile,setSendFile] = useState({status:"",text:""});

     // состояния для отслеживания при отправление формы
     const [stateSubmit,setStateSubmit] = useState({color:"primary",text:
             peopleId === 0 ? "Зарегистрироваться" : "Внести изменения"});

     // состояния для вызова alert
     const [showAlert,setShowAlert] = useState({show:false,text:""});


      // получаем данные
      const {data,isLoading,isError} = useQuery({
            queryKey:["profile_or_registration"],
            queryFn:async () => {
                if(peopleId !== 0) {
                    // получаем данные только тогда когда они есть
                    const {data} = await authNodeExpress(token)
                        .get(`/get-user-info/${peopleId}`)
                        .catch();
                    if (data.id) {
                        setPeople(data);
                    } // if
                } // if
                return people;
            }
      });

      // схема для валидации
      const validationScheme = Yup.object({
            surname:Yup.string().required("Фамилия обязательна"),
            name:Yup.string().required("Имя обязательна"),
            patronymic:Yup.string().required("Отчество обязательно"),
            number:Yup.string().required("Телефон обязателен")
                .matches(/^\+\d{1}\s*\d{3}\s*\d{3}\s*\d{2}\s*\d{2}$/,"Формат +0 000 000 00 00"),
            passport:Yup.string().required("Паспорт обязателен")
                .matches(/^\d{4}\s*\d{6}$/,"Формат 0000 000000"),
            username:Yup.string()
                .matches(/^([a-zA-Z0-9_]{3,20})$/).required("Логин обязателен"),
            password:peopleId === 0 ? Yup.string().required("Пароль обязателен").min(8,"Минимальная длина 8 символов")
                .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                    "Пример пароля - Abscad1245!") : Yup.string().notRequired(),
            gender:Yup.number().required("Пол обязателен"),
            email:Yup.string().required("Почта обязательна")
                .email(
                    "Почта не соответствует формату name@mail.com")
      });

      const formik = useFormik(
          {
              initialValues:people,
              enableReinitialize: true,
              validationSchema: validationScheme,
              onSubmit: (values: People, formikHelpers: FormikHelpers<People>) => {


                  // данные логин и предпринимателя
                  // добавляем данные
                  const sendLogin = {username:values.username,
                      password:values.password ?? "",email:values.email};
                  const sendPeople:PeopleSend = {id:people.id,
                      surname:values.surname,
                      name:values.name,
                      patronymic:values.patronymic
                      ,number:values.number,passport:values.passport,path:people.path,
                      gender:values.gender};

                  console.log(sendPeople,sendLogin);

                  // устанавливаем в default
                  setShowAlert({show: false,text:""});

                  // устанавливаем состояния для оповещения пользователю
                  setStateSubmit({color:"warning",text:"Отправка"});
                  if(peopleId === 0) {
                      // отправление данных на сервер
                      // когда успешно в это тело изменить состояния и перенаправления
                      // когда с ошибкой то алерт
                      // и вывод ошибки
                      authNode.post('/registration', {people: sendPeople, account: sendLogin})
                          .then(_ => {

                              // устанавливаем
                              setStateSubmit({color: "success", text: "Успешно"});

                              // производим перенаправление на страницу входа
                              setTimeout(() => redirect('/'), 300);
                          }).catch((e: AxiosResponse) => {
                          // логирование
                          console.error(e);
                          // вызываем alert
                          setShowAlert({show: true, text: handleStatus(e.status ?? 503).handle()});
                          // установливаем заново
                          setStateSubmit({color: "primary", text: "Войти"})
                      });
                  } else {

                      // обновляем данные о пользователе
                      authNode.put('/update-user', {people: sendPeople,
                          account: sendLogin})
                          .then(_ => {

                              // устанавливаем
                              setStateSubmit({color: "success", text: "Успешно"});

                              // производим перенаправление на главную страницу другого layout
                              setTimeout(() => redirect('/companyMapPlaces'), 300);
                          }).catch((e: AxiosResponse) => {
                          // логирование
                          console.error(e);
                          // вызываем alert
                          setShowAlert({show: true, text: handleStatus(e.status ?? 503).handle()});
                          // установливаем заново
                          setStateSubmit({color: "primary", text: "Внести изменения"})
                      });
                  } // if
              }
          }
      )

    // если ошибка
    if(peopleId !== 0 && isError) return <ErrorAlert name="Ошибка профиль не загружен"/>

    // загрузка данных если потребуется
    if(peopleId !== 0 && isLoading) return <LoadingAlert name="Профиль загружается"/>


      // обработка отправление фотографии на сервер
      const photoSubmit = (e:any) => {
             // отмена стандартных действий
             e?.preventDefault();

             // статус загрузки
             setSendFile({status: "warning",text: "Файл отправляется"});

             // файл
             const file = e.target.files[0];
             // формируем данные для отправки
             const formData = new FormData();
             // добавляем
             formData.append('file',file);
             // установили новые данные
             setPeople(prev => ({...prev,path:file.name}));

             // отправляем данные
             photoNode.post('/add-photo',formData)
                 .then(e =>
                     setSendFile({status: "success",text:handleStatus(e.status).handle()}))
                 .catch(e => setSendFile({status: "danger",
                     text:handleStatus(e.status ?? 503).handle()}));
      };



      // разметка
      return (<>
            <h3 className="text-center my-3">{peopleId === 0 ?
                "Регистрация пользователя" :
                "Пользовательские данные"}</h3>

          <div className="d-flex justify-content-center">
           <Card className="my-2 p-4 shadow-sm">
               <Row>
                   <Col  xs={3}>
                     <Image  style={{width:180}}
                            src={`http://localhost:5076/images/${people.path}`}
                            fluid roundedCircle/>
                      <Form.Group className="mt-2">
                          <Form.Control onChange={  photoSubmit}  accept="image/*" type="file"/>
                          { sendFile.text !== "" && <Alert className="mt-2 text-center"
                                                           variant={sendFile.status} >{sendFile.text}</Alert>}
                      </Form.Group>

                   </Col>
                   <Col  xs={9}>
                       <FormikProvider value={formik}>
                           <Form onSubmit={formik.handleSubmit}>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Фамилия</Form.Label>
                                        <Field placeholder="Иванов" name="surname"
                                               type="text"
                                               as={Form.Control}
                                               isInvalid={formik.touched.surname && formik.errors.surname}
                                        />
                                        <ErrorMessage name="surname"
                                                      component="div"
                                                      className="text-danger"/>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Имя</Form.Label>
                                        <Field placeholder="Иван" name="name"
                                               type="text"
                                               as={Form.Control}
                                               isInvalid={formik.touched.name && formik.errors.name}
                                        />
                                        <ErrorMessage name="name"
                                                      component="div"
                                                      className="text-danger"/>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Отчество</Form.Label>
                                        <Field placeholder="Иванович" name="patronymic"
                                               type="text"
                                               as={Form.Control}
                                               isInvalid={formik.touched.patronymic && formik.errors.patronymic}
                                        />
                                        <ErrorMessage name="patronymic"
                                                      component="div"
                                                      className="text-danger"/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Паспорт</Form.Label>
                                        <Field placeholder="0000 000000" name="passport"
                                               type="text"
                                               as={Form.Control}
                                               isInvalid={formik.touched.passport && formik.errors.passport}
                                        />
                                        <ErrorMessage name="passport" component="div"
                                                      className="text-danger"/>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Номер телефона</Form.Label>
                                        <Field placeholder="+0 000 000 00 00" name="number"
                                               type="text"
                                               as={Form.Control}
                                               isInvalid={formik.touched.number && formik.errors.number}
                                        />
                                        <ErrorMessage name="number" component="div"
                                                      className="text-danger"/>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Пол</Form.Label>
                                        <Form.Group>
                                         <Form.Check type="radio" onChange={e =>
                                             formik.setFieldValue("gender",+e.target.value)}
                                                checked={formik.values?.gender === 0}
                                                label="Мужской" name="gender" value="0" inline/>
                                         <Form.Check type="radio"
                                                     onChange={e =>
                                                         formik.setFieldValue("gender",+e.target.value)}
                                                     checked={formik.values?.gender === 1}
                                                     value="1"
                                                     label="Женский" name="gender" inline/>
                                            <ErrorMessage name="gender" component="div"
                                                          className="text-danger"/>

                                        </Form.Group>
                                    </Form.Group>
                                </Col>

                                <Row className="mt-2 mb-3">
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Логин</Form.Label>
                                            <Field placeholder="username123" name="username"
                                                   type="text"
                                                   as={Form.Control}
                                                   isInvalid={formik.touched.username && formik.errors.username}></Field>
                                            <ErrorMessage
                                                name="username" component="div" className="text-danger"/>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Почта</Form.Label>
                                            <Field placeholder="data@mail.com" name="email"
                                                   type="text"
                                                   as={Form.Control}
                                                   isInvalid={formik.touched.username && formik.errors.username}></Field>
                                            <ErrorMessage
                                                name="email" component="div" className="text-danger"/>
                                        </Form.Group>
                                    </Col>
                                    <Col>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Пароль</Form.Label>
                                            <Field name="password"  type={showPassword
                                                ? "text" : "password"} as={Form.Control}
                                              isInvalid={formik.touched.password && formik.errors.password}
                                            />
                                            <ErrorMessage
                                                name="password" component="div" className="text-danger"/>
                                        </Form.Group>

                                        <Form.Group >
                                            <Form.Check checked={showPassword}
                                                        onChange={e => setShowPassword(e.target.checked)}
                                                        type="switch"
                                                        id="custom-switch"
                                                        label="Показать пароль"></Form.Check>
                                        </Form.Group>
                                    </Col>

                                </Row>
                            </Row>

                           <div className="d-grid">
                               <Button type="submit" variant={stateSubmit.color}>{stateSubmit.text}</Button>
                           </div>

                           { showAlert.show && <Alert className="mt-2 text-center"
                                                      variant="danger">{showAlert.text}</Alert>}
                           </Form>
                       </FormikProvider>
                   </Col>
               </Row>
           </Card>
          </div>
      </>);
};
export default Registration;