// компонент для анализа рекомендации
import {useQuery} from "@tanstack/react-query";
import {analysisNode} from "../../../axios/path";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux";
import LoadingAlert from "../../alerts/LoadingAlert";
import ErrorAlert from "../../alerts/ErrorAlert";
import {RecommendationData} from "../../../models/interfaces/RecommendationData";
import {RecommendationResult} from "../../../models/interfaces/RecommendationResult";
import {RecommendationPlace} from "../../../models/interfaces/RecommendationPlace";
import {Accordion, Badge, Button, ListGroup, ListGroupItem} from "react-bootstrap";
import {useNavigate} from "react-router";

const RecommendationAnalysis = () => {
     // получаем данные с redux
     const {peopleId} = useSelector((e:RootState) => e.account);

     // хук для навигации
     const navigate = useNavigate();

     // обращаемся к серверу
     const {data,isLoading,isError} = useQuery({
        queryKey:["recommendations"],
        queryFn:async ():Promise<RecommendationPlace[]> => {
             // получаем данные про рекомендации
             const {data} = await analysisNode
                 .get(`/recommendation/${peopleId}`);
             // возвращаем данные
             return data;
        }, staleTime:10*60*1000,

     });

    // если ошибка
    if(isError) return <ErrorAlert
        name="Рекомендации не загрузились"/>

     // проверка
     if(isLoading) return <LoadingAlert name="Рекомендации загружаются"/>

     console.log(data);
     // рендер
    const render = data?.map((company) => (
        <Accordion.Item key={company.id} eventKey={company.id.toString()}>

            <Accordion.Header>

                <div className="d-flex align-items-center w-100">

                <span className="fw-semibold me-2">
                    {company.name}
                </span>

                    <Badge bg="success" className="ms-auto">
                        {company.recommendations.length} рекомендаций
                    </Badge>

                </div>

            </Accordion.Header>

            <Accordion.Body>

                <p className="fw-semibold text-muted mb-3">
                    Рекомендованные точки
                </p>

                <ListGroup>

                    {company.recommendations.map((place, index) => (
                        <ListGroup.Item
                            key={index}
                            className="d-flex justify-content-between align-items-center"
                        >

                            <div>

                                <div className="fw-semibold">
                                    Результат:
                                    <Badge bg="primary" className="ms-2">
                                        {new Intl.NumberFormat("en", {
                                            style: "percent",
                                            minimumFractionDigits: 2
                                        }).format(place.result)}
                                    </Badge>
                                </div>

                                <div className="text-muted small">
                                    X: {place.x} | Y: {place.y}
                                </div>

                                <div className="text-muted small">
                                    Адрес: <b>{place.placement}</b>
                                </div>

                            </div>

                            <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => {
                                    navigate(
                                        `/companyPlace/0/recommendations?x=${place.x}&y=${place.y}&companyId=${company.id}`
                                    );
                                }}
                            >
                                Создать точку
                            </Button>

                        </ListGroup.Item>
                    ))}

                </ListGroup>

            </Accordion.Body>

        </Accordion.Item>
    ));

     // возвращаем
    return (
        <>
            <h2 className="fw-semibold text-center my-4">
                Рекомендации по расширению точек компаний
            </h2>

            { render?.length !== 0 ?  <Accordion alwaysOpen className="shadow-sm my-2">
                {render}
            </Accordion> : <p className="text-center fw-semibold text-secondary mt-2">Пока рекомендаций нет</p> }
        </>
    );
};

export default RecommendationAnalysis;