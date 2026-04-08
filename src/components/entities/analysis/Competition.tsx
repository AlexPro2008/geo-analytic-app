// Отображение конкуренции
import {AnalysisData} from "../../../models/interfaces/AnalysisData";
import {useQuery} from "@tanstack/react-query";
import {analysisNode, companyPlaceNode} from "../../../axios/path";
import ErrorAlert from "../../alerts/ErrorAlert";
import LoadingAlert from "../../alerts/LoadingAlert";
import {ListGroup, ListGroupItem, Table} from "react-bootstrap";
import {recommendationConcurrency, resultDefault} from "../../../other/score";
import AnalysisCard from "./AnalysisCard";
import Recommendation from "./Recommendation";

// Компонент для отображения конкурентной зоны
const Competition = ({param}
                     :{param:AnalysisData}) => {

       // отправляем запрос
       const { data, error:error, isLoading } = useQuery({
              queryKey: ['competition'],
              queryFn: async ():Promise<any> => {
                     const response = await analysisNode
                         .post('/competition',param)
                         .catch();
                     return response?.data;
              }
       });
       console.log(data);
       // ошибка
       if(error) return <ErrorAlert name={"Возникла ошибка с аналитикой конкуренции"}/>

       // загрузка
       if(isLoading) return <LoadingAlert name={"Данные загружаются"}/>

       // округляем в процент
       const percent = Math.round(data?.score * 100);

       // результат
       const scoreResult = resultDefault(percent);

       // рекомендации
       const recommendation = recommendationConcurrency(percent);

       return <AnalysisCard percent={percent}
                            variant={scoreResult.variant}
                            text={scoreResult.text}
                            header="Конкурентоспособность"
                            description="эффективность конкуренции">
           <ListGroup className="small text-start">
           <ListGroupItem>
               📍 Ваши точки: <b>{data?.countOwnPlace}</b>
           </ListGroupItem>
           <ListGroupItem>
               ⚔️ Конкуренты: <b>{data?.countConcurrencyPlace}</b>
           </ListGroupItem>
           <ListGroupItem>
               📊  Аналогичный тип вида деятельности: <b>{data?.countWithActivityType}</b>
           </ListGroupItem>
           </ListGroup>
           <Recommendation recommendation={recommendation}/>
       </AnalysisCard>
};
export default Competition;