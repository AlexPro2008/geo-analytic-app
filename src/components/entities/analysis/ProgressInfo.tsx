// Внутрення информация
import {ProgressBar} from "react-bootstrap";

const ProgressInfo = ({percent,variant,text,description}
                      :{percent:number,variant:string,text:string,description:string}) =>
    (<><div className={`display-4 fw-bold text-${variant}`}>
    {percent}%
</div>

<div className={`badge bg-${variant} mb-3`}>
    {text} {description}
</div>

<ProgressBar min={0} max={100} animated now={percent} variant={variant}
             className="mb-3"/></>)
;
export default ProgressInfo;