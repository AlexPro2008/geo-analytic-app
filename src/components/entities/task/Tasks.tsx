// отображение задач для предпринимателя
import {useQuery} from "@tanstack/react-query";
import {CompanyShow} from "../../../models/interfaces/Company";
import {analysisNode, companyNode, companyPlaceNode, taskNode} from "../../../axios/path";
import {NavLink, useLocation, useNavigate} from "react-router";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux";
import ErrorAlert from "../../alerts/ErrorAlert";
import LoadingAlert from "../../alerts/LoadingAlert";
import {Button, Card, Col, Row} from "react-bootstrap";
import {typeCompanyPlaceTo} from "../../../models/TypeCompanyPlace";
import {BaseNameTypeGeoPoint} from "../../../models/BaseNameTypeGeoPoint";
import {Task} from "../../../models/interfaces/Task";
import {useState} from "react";

const Tasks = () => {
    // ид
    const id = useSelector((e:RootState)=> e.account.peopleId);

    // навигация
    const navigate = useNavigate();

    // множество задач
    const [tasks,setTasks] = useState<Task[]>([]);

    // вызываем хук для обработки данных
    const { data, error, isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: async ():Promise<Task[]> => {
            const {data} = await
                 taskNode.get(`/get-all-task-by-id/${id}`)
                    .catch();
           if(data) {
               setTasks(data);
               return data;
           } // if
            return [];
        }
    });


    // проверка загрузки компаний
    // наименования сущности
    const name:string = "Ваши задачи";

    // проверка если есть ошибка
    if(error) return <ErrorAlert name={name}/>

    // проверяем загрузку
    if(isLoading) return <LoadingAlert name={name}/>

    // изменить точку
    const changeTask = (e:any,id:number) =>
    {  navigate(`/task`,{state:{id:id}});  }

    // удалить точку
    const removeTask = async(e:any,id:number) => {
        // отправляем запрос на удаление и если успешно удаляем с front
        try {
            const res = await taskNode.delete(`/remove-task-by-id/${id}`);
            console.log(res);
            const result = tasks?.filter(e => e.id !== id);
            setTasks(result ?? []);
        } catch (e) {
            console.error(e);
        } // try-catch
    };
    // показываний задача
    const showTasks = tasks?.map((item) =>
        (<>
            <Col key={item.id} xl={8} md={6} lg={4}>
                <Card className="mb-1 p-3 w-auto shadow-sm">
                    <Card.Title className="text-center">
                        {item.title}
                    </Card.Title>
                    <hr/>
                    <Card.Body className="d-flex flex-column">
                        <p className="card-text text-break mb-2">Цель: {item.target} </p>
                        <p className="mb-2">Описание: {item.description} </p>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between">
                        <Button onClick={e => changeTask(e,item.id)} variant="outline-primary">Изменить</Button>
                        <Button onClick={e => removeTask(e,item.id)} variant="outline-danger">Удалить</Button>
                    </Card.Footer>
                </Card>
            </Col>
        </>));

    // направление
    const addTask = (e:any) => {
          navigate('/task',{state:{id:0}});
    };


    // возвращаем разметку
    return (<>
        <h2 className="fw-semibold text-center">Ваши задачи</h2>
        <div className="py-3">
            { tasks.length !== 0 ? (<>
                <p className="text-center"><Button onClick={addTask} variant="outline-success">
                    Создать задачу
                </Button></p>
                <p className="text-center small text-muted">Создайте себе напоминания , чтобы потом не забыть</p>
                <Row
                    className="d-flex justify-content-center">
                    {showTasks}
                </Row>

            </>) : (<>

                <p className="text-center"><Button onClick={addTask} variant="outline-success">
                    Создать задачу
                </Button></p>
                <p className="text-center small text-muted">Создайте себе напоминания , чтобы потом не забыть</p>

            </>)
            }
        </div></>);
};
export default Tasks;