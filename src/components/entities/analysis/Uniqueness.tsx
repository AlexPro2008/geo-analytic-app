import {ListGroup, ListGroupItem, ProgressBar} from "react-bootstrap";
import {AnalysisData} from "../../../models/interfaces/AnalysisData";
import {useQuery} from "@tanstack/react-query";
import { analysisNode } from "../../../axios/path";
import ErrorAlert from "../../alerts/ErrorAlert";
import LoadingAlert from "../../alerts/LoadingAlert";
import AnalysisCard from "./AnalysisCard";
import {recommendationUniqueness, resultDefault} from "../../../other/score";
import CardShadowDefault from "./CardShadowDefault";
import {ScoreState} from "../../../models/interfaces/ScoreDefinition";
import Recommendation from "./Recommendation";

// Компонент для отображения оценки уникальности
const Uniqueness = ({param}
                    :{param:AnalysisData}) => {
    // отправляем запрос
    const { data, error:error, isLoading } = useQuery({
        queryKey: ['uniqueness'],
        queryFn: async ():Promise<any> => {
            const response = await analysisNode
                .post('/uniqueness',param)
                .catch();
            return response?.data;
        }
    });

    // ошибка
    if(error) return <ErrorAlert name={"Возникла ошибка с аналитикой уникальность"}/>

    // загрузка
    if(isLoading) return <LoadingAlert name={"Данные загружаются"}/>


    // проценты
    const percent= Math.round(data?.score * 100);
    // результат
    const result:ScoreState = resultDefault(percent);

    // рекомендации по уникальности
    const recommendation = recommendationUniqueness(percent);

    // возвращаем
    // данные готовы
    return <AnalysisCard percent={percent}
                         variant={result.variant}
                         text={result.text}
                         header="Уникальность"
                         description="эффективность уникальности вида деятельности">
        <ListGroup className="small text-start">
            <ListGroupItem>
                📍 конкуренты: <b>{data?.count}</b>
            </ListGroupItem>
        </ListGroup>
        <Recommendation recommendation={recommendation}/>
    </AnalysisCard>
};
export default Uniqueness;