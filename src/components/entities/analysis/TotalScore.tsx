// Общая оценка
import LoadingAlert from "../../alerts/LoadingAlert";
import ErrorAlert from "../../alerts/ErrorAlert";
import {useQuery} from "@tanstack/react-query";
import {analysisNode} from "../../../axios/path";
import {AnalysisData} from "../../../models/interfaces/AnalysisData";
import {Badge, ListGroup, ListGroupItem, OverlayTrigger, ProgressBar, Tooltip} from "react-bootstrap";
import CardShadowDefault from "./CardShadowDefault";
import ProgressInfo from "./ProgressInfo";
import {
    recommendationTotal, resultDefault,
    resultDensity,
    score
} from "../../../other/score";
import {ScoreState} from "../../../models/interfaces/ScoreDefinition";
import Recommendation from "./Recommendation";

const TotalScore = ({param}
                    :{param:AnalysisData}) => {

    // отправляем запрос
    const { data, error:error, isLoading } = useQuery({
        queryKey: ['total_score'],
        queryFn: async ():Promise<any> => {
            const response = await analysisNode
                .post('/total-score',param)
                .catch();
            return response?.data;
        }
    });

    // ошибка
    if(error) return <ErrorAlert name={"Возникла ошибка с аналитикой общей оценки"}/>

    // загрузка
    if(isLoading) return <LoadingAlert name={"Данные загружаются"}/>

    // процент
    const percent = Math.round(data?.total * 100);

    // оценка общего результата
    const scoreResult = score(percent,{variant:"danger",
        text:"низкий"},
        {variant:"warning",text:"нормальный"},{variant:"success",text:"идеальный"});


    // конкуренции
    const percentConcurrency = Math.round(data?.concurrency * 100);
    // дистанции
    const percentDistance = Math.round(data?.distance * 100);
    // плотности
    const percentDensity = Math.round(data?.density * 100);
    // уникальность
    const percentUniqueness = Math.round(data?.uniqueness * 100);

    // оценка конкуренции
    const concurrency = resultDefault(percentConcurrency);

    // оценка дистанции
    const distance = resultDefault(percentDistance);

    // оценка плотности
    const density= resultDensity(percentDensity);

    // оценка уникальности
    const uniqueness = resultDefault(percentUniqueness);

    // рекомендации
    const recommendation = recommendationTotal(percent);



    // возвращаем
    return <CardShadowDefault header="Общий результат">
          <ProgressInfo percent={percent}
                        variant={scoreResult.variant}
                        text={scoreResult.text}
                        description="результат заданой точки в области"/>

        <hr/>

        <div className="mb-2">
            <h6 className="text-muted">Конкурентоспособность</h6>
            <OverlayTrigger
                delay={{ show: 250, hide: 400 }}
                overlay={<Tooltip>
                    Оценка  {percentConcurrency} %
                </Tooltip>}>
            <ProgressBar min={0} max={100} animated now={percentConcurrency}
                     variant={concurrency.variant}
                     className="mt-1"/>
            </OverlayTrigger>
            <small>
                {concurrency.text} эффективность
            </small>
         </div>


        <div className="mb-2">
            <h6 className="text-muted">Дистанция</h6>
            <OverlayTrigger
                delay={{ show: 250, hide: 400 }}
                overlay={<Tooltip>
                    Оценка  {percentDistance} %
                </Tooltip>}>
            <ProgressBar min={0} max={100} animated now={percentDistance}
                         variant={distance.variant}
                         className="mt-1"/>
            </OverlayTrigger>
            <small>
                {distance.text} эффективность
            </small>
        </div>

        <div className="mb-2">
            <h6 className="text-muted">Давление рынка</h6>
            <OverlayTrigger
                delay={{ show: 250, hide: 400 }}
                overlay={<Tooltip>
                    Оценка {percentDensity} %
                </Tooltip>}>
            <ProgressBar min={0} max={100} animated now={percentDensity}
                         variant={density.variant}
                         className="mt-1"/>
            </OverlayTrigger>
            <small>
                {density.text}
            </small>
        </div>

        <div className="mb-1">
            <h6 className="text-muted">Уникальность</h6>
            <OverlayTrigger
                delay={{ show: 250, hide: 400 }}
                overlay={<Tooltip>
                   Оценка {percentUniqueness} %
                </Tooltip>}>
            <ProgressBar min={0} max={100} animated now={percentUniqueness}
                         variant={uniqueness.variant}
                         className="mt-1"/>
            </OverlayTrigger>
            <small>
                {uniqueness.text} эффективность
            </small>
        </div>
            <Recommendation recommendation={recommendation}/>

    </CardShadowDefault>

};
export default TotalScore;