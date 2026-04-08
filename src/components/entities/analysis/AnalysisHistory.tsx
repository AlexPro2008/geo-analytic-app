// История аналитики точек
import {useQuery} from "@tanstack/react-query";
import {analysisNode} from "../../../axios/path";
import {Button, Card, Col, Row} from "react-bootstrap";
import ErrorAlert from "../../alerts/ErrorAlert";
import LoadingAlert from "../../alerts/LoadingAlert";
import TotalScore from "./TotalScore";
import {AnalysisData} from "../../../models/interfaces/AnalysisData";
import TotalScoreHistory from "./TotalScoreHistory";
import {AnalysisHistoryData} from "../../../models/interfaces/AnalysisHistoryData";
import {NavLink, useNavigate} from "react-router";

const AnalysisHistory = ({id}
                         :{id:number}) => {

    // хук для направления
    const navigate = useNavigate();

    // отправляем запрос на историю аналитики
    const { data:history, isLoading,isError } = useQuery({
        queryKey: ['history_analysis'],
        queryFn: async ():Promise<AnalysisHistoryData[]> => {
            const response = await analysisNode
                .get(`/get-history-analysis-by-id/${id}`)
                .catch();
            return response.data;
        }
    });

    // если ошибка
    if(isError) return <ErrorAlert name="Ваша история аналитики не загрузилась"/>

    // загружается
    if(isLoading) return <LoadingAlert name="История аналитики загружается"/>

    // проецируем
    const historyRender = history?.map(e =>
        <Col xl={4} md={6} lg={8}><TotalScoreHistory onClick={() => {

                navigate(`/companyPlace/0/analysis/?x=${e.x}&y=${e.y}`);
        }} total={e.total}
                           isAccept={e.accept}
                           concurrency={e.concurrency}
                           distance={e.distance}
                                density={e.density} uniqueness={e.uniqueness}/></Col>);

    return <>

        <p className="fw-semibold text-center my-2 ">История аналитики</p>
        <hr/>
        { historyRender?.length !== 0 ?
        <Row className="d-flex justify-content-center">
            {historyRender}
        </Row> :  <p className="text-center">Пока истории нет</p>
        }
    </>
};
export default AnalysisHistory;