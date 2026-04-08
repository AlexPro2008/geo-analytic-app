// Для истории аналитики
import {recommendationTotal, resultDefault, resultDensity, score} from "../../../other/score";
import CardShadowDefault from "./CardShadowDefault";
import ProgressInfo from "./ProgressInfo";
import {Alert, Button, OverlayTrigger, ProgressBar, Tooltip} from "react-bootstrap";
import Recommendation from "./Recommendation";
import TotalScoreGeneral from "./TotalScoreGeneral";
import {redirect, useNavigate} from "react-router";

const TotalScoreHistory = ({total,
                               concurrency,
                               distance,
                               density,
                               uniqueness,isAccept,onClick}:{total:number,
    concurrency:number,
    distance:number,density:number,
    uniqueness:number,isAccept:boolean,onClick:any}) => {


    // проценты

    // процент
    const percent = Math.round(total);

    // оценка общего результата
    const scoreResult = score(percent,{variant:"danger",
            text:"низкий"},
        {variant:"warning",text:"нормальный"},{variant:"success",text:"идеальный"});


    // конкуренции
    const percentConcurrency = Math.round(concurrency * 100);
    // дистанции
    const percentDistance = Math.round(distance * 100);
    // плотности
    const percentDensity = Math.round(density * 100);
    // уникальность
    const percentUniqueness = Math.round(uniqueness * 100);

    // оценка конкуренции
    const concurrencyScore = resultDefault(percentConcurrency);

    // оценка дистанции
    const distanceScore = resultDefault(percentDistance);

    // оценка плотности
    const densityScore= resultDensity(percentDensity);

    // оценка уникальности
    const uniquenessScore = resultDefault(percentUniqueness);

    // рекомендации
    const recommendation = recommendationTotal(percent);


    // возвращаем
    return <TotalScoreGeneral percent={percent}
                              scoreResult={scoreResult}
                              percentConcurrency={percentConcurrency}
                              concurrency={concurrencyScore}
                              percentDistance={percentDistance}
                              distance={distanceScore}
                              percentDensity={percentDensity}
                              density={densityScore}
                              percentUniqueness={percentUniqueness}
                              uniqueness={uniquenessScore}
                              recommendation={recommendation}>
        {
            percent >= 60 && <Button onClick={onClick}
                                     variant="outline-success">Открыть точку</Button>

        }
        {
            isAccept && <OverlayTrigger
                placement="right"
                delay={{ show: 450, hide: 700 }}
                overlay={<Tooltip>Точка принято</Tooltip>}
            >
                <Alert className="h-25 d-flex text-center">Принят</Alert></OverlayTrigger>
        }

    </TotalScoreGeneral>
};
export default TotalScoreHistory;