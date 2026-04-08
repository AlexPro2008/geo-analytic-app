// Точки компаний


import {useQuery} from "@tanstack/react-query";
import {CompanyShow,} from "../../../models/interfaces/Company";
import {companyNode, companyPlaceNode} from "../../../axios/path";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux";
import LoadingAlert from "../../alerts/LoadingAlert";
import {
    Button,
    ButtonGroup,
    Card,
    Col,
    Dropdown,
    Form,
    ListGroup,
    ListGroupItem,
    OverlayTrigger,
    Row, Tooltip
} from "react-bootstrap";
import {ChangeEvent, useState} from "react";
import ErrorAlert from "../../alerts/ErrorAlert";
import {typeCompanyPlaceTo, typeCompanyPlaceToVariant} from "../../../models/TypeCompanyPlace";
import {BaseNameTypeGeoPoint} from "../../../models/BaseNameTypeGeoPoint";
import {CompanyPlace, CompanyPlaceInfoCompany} from "../../../models/interfaces/CompanyPlace";
import SuccessAlert from "../../alerts/SuccessAlert";
import {NavLink, useNavigate} from "react-router";
import {set} from "@pbe/react-yandex-maps/typings/util/set";

const CompanyPlaces = () => {

    // используем глобальное хранилище для просмотра компании
    const idPeople = useSelector((e:RootState) => e.account.peopleId);

    // стейт для отображения
    const [data,setData] = useState<CompanyPlaceInfoCompany[]>();

    // стейт для хранения строки
    const [search,setSearch] = useState<string>("");

    // хук для отображения
    const navigate = useNavigate();

    // используем хук UseQuery для отображения
    // списка точек для последующего выбора
    const { data:companyPlaces,error:errorCompanies, isLoading:isLoadingCompanies } = useQuery({
        queryKey: ['company_places'],
        queryFn: async ():Promise<CompanyPlaceInfoCompany[]> => {
            const response = await companyPlaceNode
                  .get(`/get-company-places-by-enterpriser/${idPeople}`)
                .catch();
            setData(response?.data?.places);
            return response?.data?.places;
        }
    });

    // проверка загрузки компаний
    // наименования сущности
    const name:string = "Точки компаний";

    // проверка если есть ошибка
    if(errorCompanies) return <ErrorAlert name={name}/>

    // проверяем загрузку
    if(isLoadingCompanies) return <LoadingAlert name={name}/>

    // изменить точку
    const changePlace = (e:any,id:number) =>
    {  navigate(`/companyPlace/${id}/companyPlaces`);  }

    // удалить точку
    const removePlace = async(e:any,id:number) => {
        // отправляем запрос на удаление и если успешно удаляем с front
        try {
            const res = await companyPlaceNode.delete(`/delete-company-place/${id}`);
            console.log(res);
            const result = companyPlaces?.filter(e => e.id !== id);
            setData(result);
        } catch (e) {
            console.error(e);
        } // try-catch

    };
    // отобразить нормально точки предприятий
    // список для отображения
    const showCompanyPlaces = data?.map((item) =>
        (<>
            <Col key={item.id} xl={8} md={6} lg={4}>
                <Card className="mb-1 p-3 w-auto shadow-sm">
                    <Card.Title className="text-center">
                        {item.id} - {item.name}
                    </Card.Title>
                    <hr/>
                    <Card.Body className="d-flex flex-column">
                        <p className="card-text text-muted text-break mb-2">{item.description} </p>
                        <p className="mb-1"><strong>Тип точки:</strong> {typeCompanyPlaceTo(item.type,
                            new BaseNameTypeGeoPoint(),"")}</p>
                        <p className="mb-1">
                            <strong>Координаты:</strong>{" "}
                            {`${item.x}, ${item.y}`}
                        </p>
                        <p className="mb-1"><strong>Точка главная</strong> {item.isMain ? "да": "нет"}</p>
                        <p className="mb-1"><strong>Площадь размещения</strong> {item.area} (м²)</p>
                        <p className="mb-1"><strong>Адрес:</strong> {item.placement}</p>
                        <p className="mb-2"><strong>Компания:</strong> {item.companyName}</p>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between">
                        <Button onClick={e => changePlace(e,item.id)} variant="outline-primary">Изменить</Button>
                        <Button onClick={e => removePlace(e,item.id)} variant="outline-danger">Удалить</Button>
                    </Card.Footer>
                </Card>
            </Col>
        </>));

    // возвращаем разметку
    return (<>
        <h2 className="fw-semibold text-center">Точки компании</h2>

        <p
            className="small mb-2 text-muted text-center">
            Если создаете первый раз создайте тестированную точку , чтобы потом использовать
            <br/> в аналитике или вносите данные о реально существующих точках вашего предприятия
        </p>
        <p className="text-center"><NavLink
            to="/companyPlace/0/companyPlaces" className="btn btn-outline-success">
            Создать точку
        </NavLink></p>


        <div className="d-flex justify-content-center gap-1">

            <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={<Tooltip>Сортировка по полям</Tooltip>}
            ><Dropdown className="rounded-5 my-2" as={ButtonGroup}>
                <Button onClick={() => {
                    setData([...companyPlaces ?? []].sort((a,b) => a.id - b.id));
                }} variant="outline-dark">Ид</Button>
                <Dropdown.Toggle split variant="outline-dark" id="dropdown-split-basic" />
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => {

                        setData([...companyPlaces ?? []].sort((a,b) => a.type - b.type));
                    }}>Тип точки</Dropdown.Item>
                    <Dropdown.Item onClick={() => {
                        setData([...companyPlaces ?? []].sort((a,b) => a.area - b.area));
                    }}>Площадь размещения</Dropdown.Item>
                    <Dropdown.Item onClick={() => {
                        setData([...companyPlaces ?? []].sort((a,b) => a.name
                            .length - b.name.length));
                    }}>Названия точек</Dropdown.Item>
                    <Dropdown.Item onClick={() => {
                        setData([...companyPlaces ?? []].sort((a,b) =>
                            a.companyName
                                .length - b.companyName.length));
                    }}>Компании</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown></OverlayTrigger>

            <Form.Control onChange={e => {
                const {value} = e.target;
                setData(companyPlaces?.filter(i =>
                    i.name?.
                toLowerCase().trim()
                    .includes(value.toLowerCase().trim())));
            }} placeholder="Названия точки 1..." className="rounded-3 w-50 my-2"/>

        </div>

    { data?.length !== 0 &&  <div className="py-3"><Row
            className="d-flex justify-content-center">
            {showCompanyPlaces}
        </Row></div> }
        </>);
};
export default CompanyPlaces;