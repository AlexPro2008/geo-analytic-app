// Предприятия
import {useEffect, useState} from "react";
import {Company, CompanyShow} from "../../../models/interfaces/Company";
import axios from "axios";
import {companyNode} from "../../../axios/path";
import {useQuery} from "@tanstack/react-query";
import {
    Alert, Button,
    ButtonGroup,
    Card,
    Col, Dropdown, Form, OverlayTrigger,
    Row, Tooltip
} from "react-bootstrap";
import Element = React.JSX.Element;
import ErrorAlert from "../../alerts/ErrorAlert";
import LoadingAlert from "../../alerts/LoadingAlert";
import SuccessAlert from "../../alerts/SuccessAlert";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux";
import {NavLink, useNavigate} from "react-router";


const Companies = () => {
    // вызываем селектор для выбора ид
    const id:number = useSelector((state:RootState)=> state.account.peopleId);

    // хук для перенаправления
    const navigate = useNavigate();

    // стейт для отображения
    const [companies,setCompanies] = useState<CompanyShow[]>();

    // вызываем хук для обработки данных
    const { data, error, isLoading } = useQuery({
        queryKey: ['companies'],
        queryFn: async ():Promise<CompanyShow[]> => {
            const {data} = await
                companyNode.get(`/get-all-company-by-id/${id}`)
                .catch();
           if(data) {
               // установили
               setCompanies(data);
           } // if
            return data;
        }
    });

    // наименования сущности
    const name:string = "Ваши компании";
    // проверка если есть ошибка
    if(error) return <ErrorAlert name={`${name} не загрузились`}/>
    // проверяем загрузку
    if(isLoading) return <LoadingAlert name={`${name} загружаются`}/>


    // перейти к карте
    const navigateMapCompany = (e:any,id:number) =>
        navigate(`/companyMapPlaces?companyId=${id}`);

    // создать точку
    const navigateCreatePlace = (e:any,id:number) =>
        navigate(`/companyPlace/0/companies?companyId=${id}`);

    // изменить компанию
    const changeCompany = (e:any,id:number) =>
    {  navigate(`/company`,{state:{id:id}});  }

    // удалить компанию
    const removePlace = async(e:any,id:number) => {
        // отправляем запрос на удаление и если успешно удаляем с front
        try {
            const res = await companyNode.delete(`/remove-company-by-id/${id}`);
            console.log(res);
            const result = companies?.filter(e => e.id !== id);
            setCompanies(result);
        } catch (e) {
            console.error(e);
        } // try-catch

    };

    // список для отображения
    const showCompanies:Element[] | undefined = companies?.map((item) =>
        (<>
             <Col key={item.id} xl={8} md={6} lg={4}>
               <Card className="mb-1 p-3 w-auto shadow-sm">
                     <Card.Title className="text-center">
                         {item.id} - {item.name}
                     </Card.Title>
                   <hr/>
                   <Card.Body className="d-flex flex-column">
                       <p className="card-text text-muted text-break mb-2">{item.description} </p>
                       <p className="mb-1"><strong>Вид деятельности:</strong> {item.kindActivity}</p>
                       <p className="mb-1"><strong>Количество точек:</strong> {item.count} шт.</p>
                       { item.placement.trim().length !== 0 && <p className="mb-1"><strong>Адрес:</strong> {item.placement}</p> }
                       <p className="mb-2"><strong>Владелец:</strong> {item.fullname}</p>
                   </Card.Body>
                   <Card.Footer className="d-flex justify-content-between">
                       {
                           item.count !== 0 ?  <OverlayTrigger
                                   placement="left"
                                   delay={{ show: 250, hide: 400 }}
                                   overlay={<Tooltip>При нажатии будет произведен отбор только на выбранную компанию</Tooltip>}
                               ><Button onClick={e =>
                                   navigateMapCompany(e,item.id)} variant="outline-info">🗺 Перейти к карте</Button></OverlayTrigger>
                               : <Button onClick={e => navigateCreatePlace(e,item.id)}
                                         variant="outline-secondary">Создать точку</Button>
                       }
                      <Button onClick={e => changeCompany(e,item.id)} variant="outline-primary">Изменить</Button>
                      <Button onClick={e => removePlace(e,item.id)}
                              variant="outline-danger">Удалить</Button>
                   </Card.Footer>
               </Card>
             </Col>
          </>));

    // если успешно возвращаем компании
    return (<>

        <h2 className="fw-semibold text-center">Компании</h2>
        <p
            className="small mb-2 text-muted text-center">
            Добавьте основную информацию про ваши компании
        </p>
        <p className="text-center"><Button onClick={() =>
            navigate('/company',{state:{id:0}})} variant="outline-success">
            Создать компанию
        </Button></p>

        <div className="d-flex justify-content-center gap-1">
            <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={<Tooltip>Сортировка по полям</Tooltip>}
            ><Dropdown className="rounded-5 my-2" as={ButtonGroup}>
                <Button onClick={() => {
                    setCompanies([...companies ?? []].sort((a,b) => a.id - b.id));
                }} variant="outline-dark">Ид</Button>
                <Dropdown.Toggle split variant="outline-dark" id="dropdown-split-basic" />
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => {

                        setCompanies([...data ?? []]
                            .sort((a,b) => a.kindActivityId - b.kindActivityId));
                    }}>Вид деятельности</Dropdown.Item>
                    <Dropdown.Item onClick={() => {
                        setCompanies([...data ?? []]
                            .sort((a,b) => a.count - b.count));
                    }}>Количество точек</Dropdown.Item>
                    <Dropdown.Item onClick={() => {
                        setCompanies([...data ?? []]
                            .sort((a,b) => a.name
                                .length - b.name.length));
                    }}>Компании</Dropdown.Item>
                    <Dropdown.Item onClick={() => {
                        setCompanies([...data ?? []].sort((a,b) =>
                            a.description
                                .length - b.description.length));
                    }}>Описание</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown></OverlayTrigger>

            <Form.Control onChange={e => {
                const {value} = e.target;
                setCompanies(data?.filter(i =>
                    i.name?.
                    toLowerCase().trim()
                        .includes(value.toLowerCase().trim())));
            }} placeholder="Названия компании..." className="rounded-3 w-50 my-2"/>
        </div>

        {data?.length !== 0 &&
            <div className="py-3"><Row
                className="d-flex justify-content-center">
                {showCompanies}
            </Row></div>}
   </>);
};
export default Companies;

