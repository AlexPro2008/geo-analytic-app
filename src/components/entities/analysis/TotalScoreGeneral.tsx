// общий компонент который можно переиспользовать
import ProgressInfo from "./ProgressInfo";
import {OverlayTrigger, ProgressBar, Tooltip} from "react-bootstrap";
import Recommendation from "./Recommendation";
import CardShadowDefault from "./CardShadowDefault";
import {ScoreState} from "../../../models/interfaces/ScoreDefinition";
import {RecommendationResult} from "../../../models/interfaces/RecommendationResult";

const TotalScoreGeneral = (
    {percent,scoreResult,percentConcurrency,
        concurrency,
        percentDistance,
        distance,
        percentDensity,density,
        percentUniqueness,uniqueness,recommendation,children}:{percent:number,scoreResult:ScoreState,
    percentConcurrency:number,concurrency:ScoreState,
    percentDistance:number,distance:ScoreState,
    percentDensity:number,density:ScoreState,
    percentUniqueness:number,uniqueness:ScoreState,
        recommendation:RecommendationResult,children?:any}
) => <CardShadowDefault header="Общий результат">
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

    {children}

</CardShadowDefault>;
    export default TotalScoreGeneral;