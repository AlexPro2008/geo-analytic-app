// компонент для отображения разного анализа
import {ListGroup, ProgressBar} from "react-bootstrap";
import CardShadowDefault from "./CardShadowDefault";
import ProgressInfo from "./ProgressInfo";

const AnalysisCard = (
    {percent,variant,text,header,description,children}
                      :{percent:number,variant:string,text:string
        ,header:string,description:string,children:any}) => {
    return <CardShadowDefault header={header}>
        <ProgressInfo percent={percent}
                      variant={variant}
                      text={text}
                      description={description}/>
        <hr />

        <p className="fw-semibold">Дополнительные данные</p>
            {children}
    </CardShadowDefault>
};

export default AnalysisCard;