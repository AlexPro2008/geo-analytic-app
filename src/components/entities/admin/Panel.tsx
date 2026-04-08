// Панель администратора
import {useQuery} from "@tanstack/react-query";
import {adminNode, kindActivityNode, supportNode} from "../../../axios/path";
import LoadingAlert from "../../alerts/LoadingAlert";
import ErrorAlert from "../../alerts/ErrorAlert";
import {Badge, Button, Card, Col, Form, ListGroup, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {Support} from "../../../models/interfaces/Support";
import {StatusResult, toStringResult} from "../../../models/enums/StatusResult";
import {AccountStatus} from "../../../models/enums/AccountStatus";
import {useNavigate} from "react-router";
import {useState} from "react";
import {handleStatus} from "../../../httpStatusHandler/HttpStatusContext";
import * as Yup from "yup";
import {ErrorMessage, Field, FormikHelpers, FormikProvider, useFormik} from "formik";
import {convertTypeKindActivity, TypeKindActivity} from "../../../models/enums/TypeKindActivity";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux";
import axios from "axios";

const Panel = () => {
    // хук для перенаправления
    const navigate = useNavigate();

    // получение ид
    const {peopleId} = useSelector((e:RootState) => e.account);

    // виды деятельности
    const {data:kindActivities,isLoading:isLoadingKindActivities,
           isError:isErrorKindActivities} = useQuery({
         queryKey: ["kind_activities"],
         queryFn:async ():Promise<{id:number,kindActivity:string,
           type:TypeKindActivity}[]> => {
              const {data} = await kindActivityNode
                       .get('/get-kind-activities-for-companies')
                  .catch();
              return data;
         }
    });


    // поддержка
    const {data:supports,isLoading:isLoadingSupports,
         isError:IsErrorSupports} = useQuery({
        queryKey: ["supports"],
        queryFn: async ():Promise<Support[]> => {
             const {data} = await adminNode
                         .get("/get-all-support")
                         .catch();
             return data;
        }
    });

    // получение всех пользователей
    const {data:users,isLoading:IsLoadingUsers
          ,isError:isErrorUsers} = useQuery({
           queryKey: ["users"],
           queryFn: async ():Promise<{id:number,
               email:string,
               status:AccountStatus,
               username:string,
               surname:string,
               name:string,
               patronymic:string,
               companies:{name:string,kindActivity:string}[],
               createdAt:string,
               updatedAt:string,
               deletedAt:string,
               isDeleted:boolean
           }[]> => {
               const {data} = await adminNode
                   .get('/get-all-users')
                   .catch();
               return data;
           }
    });

    // ошибка
    if(IsErrorSupports && isErrorUsers && isErrorKindActivities)
         return <ErrorAlert name="Данные не прогрузились"/>

    // загрузка
    if(isLoadingSupports && IsLoadingUsers && isLoadingKindActivities)
            return <LoadingAlert name="Данные прогружаются"/>

    const showSupports = supports?.map((item) => (
        <Col key={item.id} xl={4} lg={6} md={12}>
            <Card className="shadow-sm h-100">
                <Card.Header className="fw-semibold text-center">
                    📩 {item.email}
                </Card.Header>

                <Card.Body className="small">

                    <p className="mb-2">
                        <span className="text-muted">Тема:</span> {item.theme}
                    </p>

                    <p className="mb-2">
                        <span className="text-muted">Описание:</span> {item.description}
                    </p>

                    <p className="mb-2">
                        <span className="text-muted">Статус:</span>{" "}
                        <Badge bg={item.status === 1 ? "success" : "secondary"}>
                            {toStringResult(item.status)}
                        </Badge>
                    </p>

                    <p className="mb-0">
                        <span className="text-muted">Создано:</span>{" "}
                        {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                    </p>



                </Card.Body>

                { item.status !== StatusResult.Accept
                && item.status !== StatusResult.Reject ? <Card.Footer
                        className="px-2 py-2 d-flex justify-content-between">
                   <><Button onClick={() =>
                        {
                            navigate(`/response/${item.id}/${StatusResult.Accept}`);
                        }} variant="outline-success">Ответить</Button>
                    <Button onClick={() => {
                           navigate(`/response/${item.id}/${StatusResult.Reject}`)
                        }}
                            variant="outline-info">Отвергнуть</Button></>

                </Card.Footer>
                      : <Card.Footer className="px-2 py-2 d-flex justify-content-center"><Badge
                                            color="outline-successs">Закрыт</Badge></Card.Footer>
                }
            </Card>
        </Col>
    ));


    const showUsers = users?.map((item) => (
        <Col key={item.id} xl={4} lg={6} md={12}>

            <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={
                    <Tooltip>
                        <div className="small text-start">
                            <p className="mb-1">
                                Создан: {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                            </p>

                            { item.updatedAt && <p className="mb-1">
                                Обновлён: {new Date(item.updatedAt).toLocaleDateString('ru-RU')}
                            </p> }

                            {item.isDeleted &&
                                <p className="mb-0 text-danger">
                                    Удалён: {new Date(item.deletedAt).toLocaleDateString('ru-RU')}
                                </p>}
                        </div>
                    </Tooltip>
                }
            >

                <Card className="shadow-sm h-100">

                    <Card.Header className="fw-semibold text-center">
                        👤 {item.username}
                    </Card.Header>

                    <Card.Body className="small">

                        <p className="mb-1">
                            <span className="text-muted">Фамилия:</span> {item.surname}
                        </p>

                        <p className="mb-1">
                            <span className="text-muted">Имя:</span> {item.name}
                        </p>

                        <p className="mb-1">
                            <span className="text-muted">Отчество:</span> {item.patronymic}
                        </p>

                        <p className="mb-2">
                            <span className="text-muted">Почта:</span> {item.email}
                        </p>

                        <p className="mb-2">
                            <span className="text-muted">Статус:</span>{" "}
                            <Badge bg={item.status ? "danger" : "secondary"}>
                                {item.status ? "Админ" : "Пользователь"}
                            </Badge>
                        </p>

                        {item.companies.length > 0 && (
                            <div className="mt-3">

                                <div className="fw-semibold mb-2 text-muted">
                                    Компании
                                </div>

                                <ListGroup variant="flush" className="small">

                                    {item.companies.map((e,index) => (
                                        <ListGroup.Item
                                            key={index}
                                            className="d-flex flex-column"
                                        >
                                        <span className="fw-semibold">
                                            {e.name}
                                        </span>

                                            <span className="text-muted small">
                                            Вид деятельности: {e.kindActivity}
                                        </span>

                                        </ListGroup.Item>
                                    ))}

                                </ListGroup>

                            </div>
                        )}

                    </Card.Body>

                </Card>

            </OverlayTrigger>

        </Col>
    ));

    // виды деятельности
    const showKindActivities = kindActivities?.map(item =>

        <Col key={item.id} xl={4} lg={6} md={12}>
            <Card className="shadow-sm h-100">
                <Card.Header className="fw-semibold text-center">
                    📩 {item.kindActivity}
                </Card.Header>

                <Card.Body className="small">

                    <p className="mb-2">
                        <span className="text-muted">Тип вида деятельности:</span> {convertTypeKindActivity(item.type)}
                    </p>

                </Card.Body>
              <Card.Footer className="px-2 py-2 d-flex justify-content-center">
                   <Button onClick={() => {
                         navigate(`/kindActivity/${item.id}`);
                   }} variant="outline-success">Обновить</Button>
              </Card.Footer>

            </Card>
        </Col>
    );

    return (
        <>
            <div className="d-flex justify-content-between py-2 px-2">
                <Button variant="outline-success" onClick={() => navigate(`/profileAdmin/${peopleId}`)}> Профиль
                </Button>

                <Button onClick={() => navigate('/')}  variant="outline-secondary">Выйти</Button>
            </div>


            <h2 className="fw-semibold text-center my-4">
                Административная панель
            </h2>

            <Card className="p-4 shadow-sm">

                <Row className="mb-4">
                    <Col>
                        <h5 className="fw-semibold text-center mb-3">
                            Сообщения поддержки ({supports?.length})
                        </h5>

                        <Row className="g-3">
                            {showSupports}
                        </Row>
                    </Col>
                </Row>

                <hr />

                <Row className="mt-4">
                    <Col>
                        <h5 className="fw-semibold text-center mb-3">
                            Пользователи ({users?.length})
                        </h5>


                        <Row className="g-3">
                            {showUsers}
                        </Row>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col>
                        <h5 className="fw-semibold text-center mb-3">
                            Виды деятельности ({kindActivities?.length})
                        </h5>

                        <p className="text-center"><Button  className="mb-3" onClick={() => {
                               navigate('/kindActivity/0');
                        }} variant="outline-success">Добавить</Button></p>


                        <Row className="g-3">
                            {showKindActivities}
                        </Row>
                    </Col>
                </Row>
            </Card>
        </>
    );
};

export default Panel;