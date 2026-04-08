// Анализ плотности
import {AnalysisData} from "../../../models/interfaces/AnalysisData";
import ErrorAlert from "../../alerts/ErrorAlert";
import LoadingAlert from "../../alerts/LoadingAlert";
import {analysisNode} from "../../../axios/path";
import {useQuery} from "@tanstack/react-query";
import {Badge, ListGroup, ListGroupItem} from "react-bootstrap";
import AnalysisCard from "./AnalysisCard";
import {recommendationDensity, resultDensity} from "../../../other/score";
import Recommendation from "./Recommendation";

const Density = ({param}
                 :{param:AnalysisData}) => {
    // отправляем запрос
    const { data, error:error, isLoading } = useQuery({
        queryKey: ['density'],
        queryFn: async ():Promise<any> => {
            const response = await analysisNode
                        .post('/density',param)
                        .catch();
            return response?.data;
        }
    });

    // ошибка
    if(error) return <ErrorAlert name={"Возникла ошибка с аналитикой плотности рынка"}/>

    // загрузка
    if(isLoading) return <LoadingAlert name={"Данные загружаются"}/>



    // процент
    const percent = Math.floor(data?.score * 100);
    // расчет процентов
    const scoreResult = resultDensity(percent);
    // рекомендации
    const recommendation = recommendationDensity(percent);
    // на успешной аналитике
    return <AnalysisCard percent={percent}
                         description="давление рынка"
                         variant={scoreResult.variant}
                         text={scoreResult.text} header="Плотность">
        <ListGroup className="small text-start">
        <ListGroupItem>
            📍 точки: <b>{data?.count}</b>
        </ListGroupItem>
        <ListGroupItem>
            📊 радиус: <b>{param.radius} (м)</b>
        </ListGroupItem>
        </ListGroup>


        <Recommendation recommendation={recommendation}/>
    </AnalysisCard>;
} // Density
export default Density;