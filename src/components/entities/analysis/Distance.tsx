// компонент отображающий дистанцию
import {useQuery} from "@tanstack/react-query";
import {analysisNode} from "../../../axios/path";
import {AnalysisData} from "../../../models/interfaces/AnalysisData";
import ErrorAlert from "../../alerts/ErrorAlert";
import LoadingAlert from "../../alerts/LoadingAlert";
import {Badge, ListGroup, ListGroupItem} from "react-bootstrap";
import {recommendationDensity, recommendationDistance, resultDefault} from "../../../other/score";
import AnalysisCard from "./AnalysisCard";
import Recommendation from "./Recommendation";

const Distance = ({param}
                  :{param:AnalysisData}) => {

    // отправляем запрос
    const { data, error:error, isLoading } = useQuery({
        queryKey: ['distance'],
        queryFn: async ():Promise<any> => {
            const response = await analysisNode
                .post('/distance',param)
                .catch();
            return response?.data;
        }
    });

    console.log(data);
    // ошибка
    if(error) return <ErrorAlert name={"Возникла ошибка с аналитикой дистанции"}/>

    // загрузка
    if(isLoading) return <LoadingAlert name={"Данные загружаются"}/>


    // процент округленный
    const percent = Math.round((data?.score) * 100);

    // результат
    const scoreResult = resultDefault(percent);

    // рекомендации
    const recommendation = recommendationDistance(percent);

    return <AnalysisCard percent={percent}
                         variant={scoreResult.variant}
                         text={scoreResult.text}
                         header="Дистанция"
                         description="эффективность дистанции">
        <ListGroup className="small text-start">
        <ListGroupItem>
            📍 Ближайшая ваша точка: <b>{Math.round(data?.distanceOwnPlace)}</b> (м)
        </ListGroupItem>
        <ListGroupItem>
            ⚔️ Ближайшая точка конкурента: <b>{Math.round(data?.distanceConcurrency)}</b> (м)
        </ListGroupItem>
        <ListGroupItem>
            📊 Ближайшая точка конкурента с тем же типом: <b>{Math.round(data?.distanceConcurrencyGeneralType)}</b> (м)
        </ListGroupItem>
        </ListGroup>
        <Recommendation recommendation={recommendation}/>
    </AnalysisCard>
} // Distance
export default Distance;