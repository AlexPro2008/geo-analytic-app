// Компонент для отображения анализа уже существующих точек
import Competition from "./Competition";
import Distance from "./Distance";
import Density from "./Density";
import TotalScore from "./TotalScore";
import ErrorAlert from "../../alerts/ErrorAlert";
import {useLocation, useParams} from "react-router";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux";
import {AnalysisParam} from "../../../models/interfaces/AnalysisParam";
import {AnalysisData} from "../../../models/interfaces/AnalysisData";
import Uniqueness from "./Uniqueness";
import {Button, Col, Row} from "react-bootstrap";
import {useQuery} from "@tanstack/react-query";
import {analysisNode, companyPlaceNode} from "../../../axios/path";
import AnalysisHistory from "./AnalysisHistory";

// Анализ главного компонента
const Analysis = () => {

    // получаем данные из redux
    const {peopleId} = useSelector((e:RootState) => e.account);

    // получаем данные
    const location = useLocation();

    // param
    const param = location.state?.all?.param;

    // данные
    const data = location.state?.all?.data;

    if(!param || !data) {
       return <AnalysisHistory id={peopleId}
                               />
    } // if
    // возвращаем
    return (<>
        <Row className="d-flex justify-content-center">

            {param.general && <div className="d-flex justify-content-center"><Col md="8"><TotalScore param={data}/></Col></div>}

            { param.concurrency &&  <Col md="6"><Competition param={data}
                                          /></Col>}
            {param.distance &&  <Col md="6"><Distance param={data}/></Col>
                             }

            {param.density &&  <Col md="6"><Density param={data}
                               /></Col>}

            {param.uniqueness &&  <Col md="6"><Uniqueness param={data} /></Col>}
        </Row>

    </>);
};
export default Analysis;