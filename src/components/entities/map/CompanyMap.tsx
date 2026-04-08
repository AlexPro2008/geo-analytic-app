// Компонент отвечающий за отображения карты
import {useQuery} from "@tanstack/react-query";
import {analysisNode, companyNode, companyPlaceNode} from "../../../axios/path";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/redux";
import {
    GeolocationControl,
    Map,
    Placemark,
    Circle,
    SearchControl,
    TypeSelector,
    YMaps,
    ZoomControl
} from "@pbe/react-yandex-maps";
import ErrorAlert from "../../alerts/ErrorAlert";
import LoadingAlert from "../../alerts/LoadingAlert";
import {TypeCompanyPlace, typeCompanyPlaceTo} from "../../../models/TypeCompanyPlace";
import {ConvertPresetTypeCompanyPlace} from "../../../models/ConvertPresetTypeCompanyPlace";
import {
    Accordion,
    Button,
    Card,
    Col,
    Form,
    Image,
    ListGroup,
    Modal, Overlay,
    OverlayTrigger,
    Row,
    Tooltip
} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import {CompanyPlace, CompanyPlaceInfoCompany} from "../../../models/interfaces/CompanyPlace";
import {BaseNameTypeGeoPoint} from "../../../models/BaseNameTypeGeoPoint";
import {useNavigate, useSearchParams} from "react-router";
import {AnalysisParam} from "../../../models/interfaces/AnalysisParam";
import {AnalysisCommon} from "../../../models/interfaces/AnalysisCommon";


const CompanyMap = () => {
    // загружаем ид
    const id = useSelector((e:RootState) => e.account.peopleId);

    // хук для навигации
    const navigate = useNavigate();

    // отображаем уровень радиуса
    const [radius,setRadius] = useState<number>(100);

    // отображаем стейт [x,y]
    const [place,setPlace] = useState<{x:number,y:number}>({x:0,y:0});

    // стейт для фиксации режима добавления или изменения
    const [actionMode,setActionMode] = useState<{isAction:boolean,type:"update" | "add" | "none"}>({isAction:false,type:"none"});

    // стейт для фиксации адреса местности
    const [address,setAddresses] = useState<string>("");

    // отображать информация про точку иных компаний
    const [infoOther,setInfoOther] = useState<boolean>(false);

    // центр точки
    const [center,setCenter] = useState<{x:number,y:number}>({x:0,y:0});

    // доп параметр
    const [useParams] = useSearchParams();

    // найти навигацию
    const curCompanyId = Number
          (useParams.get('companyId') ?? 0);

    // стейт минимальной площади
    const [min,setMin] = useState<number>(0);
    // стейт максимальной площади
    const [max,setMax] = useState<number>(0);

    // стейт для хранения точек для фильтраций
    const [companyPlaces,setCompanyPlaces] = useState<any[]>([]);

    // стейт для выбора точки другой компании
    const [otherCompanyPlace,setOtherCompanyPlace] = useState<any>();

    // стейт для выбора точки для аналитики
    const [analysisPlace,setAnalysisPlace] = useState<{x:number,y:number,
        isAnalysis:boolean}>
    ({x:0,y:0,isAnalysis:false});

    // стейт для показа модального окна обновления точки
    const [showUpdateParamPlace, setShowUpdateParamPlace] = useState(false);


    // стейт для выбора конкретной задачи
    const [analysis,setAnalysis] = useState<AnalysisParam>
    ({concurrency:false,distance:false,density:false,uniqueness:false,general:false});


    // модальное окно для отображения ошибки
    const [showErrorZone,setShowErrorZone] = useState<boolean>(false);

    const handleCloseErrorZone = () => setShowErrorZone(false);
    const handleShowErrorZone = () => setShowErrorZone(true);

    // модальное окно для выбора анализа
    const [showTaskAnalysis,setShowTaskAnalysis] = useState<boolean>(false);
    const handleTaskAnalysisClose = () => setShowTaskAnalysis(false);


    // для загрузки карты
    const [map,setMap] = useState<any>();

    // для передачи информации для аналитики
    const [dataAnalysis,setDataAnalysis] = useState(
        {placeX:0,placeY:0,companyId:0,centerX:0,centerY:0,radius:radius});

    // Отображения включения анализа
    // для отображения модального окна
    const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

    const handleClose = () => setShowAnalysis(false);
    const handleShow = () => setShowAnalysis(true);

    // стейт для выбора точек
    const [companyPlace,setCompanyPlace] = useState<CompanyPlaceInfoCompany>({
        id:0,x:0,y:0,isMain:false,
        name:"",description:"",area:0,type:TypeCompanyPlace.Office,companyId:0,placement:"",companyName:""});

    // производим запрос отображение точек
    const { data, error:error, isLoading } = useQuery({
        queryKey: ['company_places'],
        queryFn: async ():Promise<any> => {
            const response = await companyPlaceNode
                .get(`/get-company-places-by-enterpriser/${id}`)
                .catch();
            setCenter(response?.data?.center);
            if(response.data.places) {
                setCompanyPlaces(response.data.places);

            if(curCompanyId !== 0) {
                setCompanyPlaces(data
                    ?.places
                    ?.filter((e: any) =>
                        e.companyId === curCompanyId));


                    const main = companyPlaces.find(e => e.isMain);

                    if(main) {
                        // опора на основную точку
                        setCenter({x: main.x, y: main.y});
                    } else {
                        const first = companyPlaces[0];
                        setCenter({x:first.x,y:first.y});
                    } // if
                } // if
            } // if

            return response?.data;
        }
    });

    // производим запрос для отображения точек других предприятий
    const {data:otherCompanyPlaces} = useQuery({
        queryKey: ['other_company_places'],
        queryFn: async ():Promise<any[]> => {
            const response = await companyPlaceNode
                .get(`/get-other-company-places/${id}`)
                .catch();
            return response?.data;
        },
        staleTime:1000 * 60 * 5
    })

    // производим запрос для просмотра всех компаний
    const {data:dataCompanies} = useQuery({
         queryKey:['companies'],
         queryFn: async():Promise<{id:number,name:string}[]> => {
              const {data} = await companyNode.get(`/get-all-default-by-id/${id}`)
                  .catch();
              if(data){
                  return data;
              }
              return [];
         }
    });



    // ошибка
    if(error) return <ErrorAlert name="Ошибка не загружены точки"/>

    // загрузка
    if(isLoading) return <LoadingAlert name="Точки загружаются"/>

    // рендер компаний
    const companiesShow = dataCompanies?.map((item:any) => (<>
           <option value={item.id}>{item.name}</option>
    </>));

    // функция для проекции
    const MapPlacemark = ({item,onClick,onContextMenu}:{item:any,onClick:any | null,onContextMenu:any|null }) =>
        <Placemark key={item.id} onContextMenu={onContextMenu} options={{ preset: typeCompanyPlaceTo(item.type,
                new ConvertPresetTypeCompanyPlace(),"islands#blueDotIcon")
        }} geometry={[item.x,item.y]} onClick={onClick}/>

    // рендер точек
    const placemarks = companyPlaces?.map((item:any) => <MapPlacemark
         item={item} onContextMenu={null}
          onClick={(e:any) => {
            setCenter({x:item.x,y:item.y});
            setCompanyPlace(item);
            setInfoOther(false);
    }}/>);


    // рендер других точек компаний
    const placemarksOtherCompanies = otherCompanyPlaces?.map((item:any) =>
      <Placemark key={item.id}
                 geometry={[item.x,item.y]}
                 onClick={() => {
                    setOtherCompanyPlace(item);
                    setInfoOther(true);
                    setCenter({x:item.x,y:item.y});
                 }}
                 options={{preset: "islands#grayDotIcon"}}/>);

    // со стороны карты не будет placement
    // так как пользователь сам выбрал это место

    // если создавать не со стороны карты
    // то placement добавиться + list-addresses

    // стрелочная ф-н для отбора
    const onClick = (e:any) => {
            // если меньше 0 то мы ставим в default
            if(min < 0) return;
            if(max < 0 || max < min) return;
            // отбор уже скопированной коллекцией
            setCompanyPlaces(companyPlaces.filter((e:any) => e.area >= min
                && e.area <= max));
    };

    // вернуть обратно
    const defaultFilterClick = (e:any) => {

        // при условие не было фокусирование
        if(curCompanyId === 0) {
            setCompanyPlaces(data.places);
        } else {
            setCompanyPlaces(data?.places?.filter((item:any) => item.companyId === curCompanyId));
        } // if

    } // defaultFilterClick

    // компонент внутренний отображения информации про иных компаний точек и этих точек
    const ShowOtherPlace = () => (<>
        <div className="mb-2">
              <strong>Названия компании:</strong> {otherCompanyPlace.companyName}
        </div>

        <div className="mb-2">
            <strong>Название точки:</strong> {otherCompanyPlace.name}
        </div>

        <div className="mb-2">
            <strong>Тип:</strong> {typeCompanyPlaceTo(companyPlace.type,new BaseNameTypeGeoPoint(),"новый вид точки")}
        </div>

        <div className="mb-2">
            <strong>Описание:</strong> {otherCompanyPlace.description}
        </div>

        <div className="mb-2">
            <strong>Точка:</strong> {otherCompanyPlace.isMain ? "Главная" : "Не главная"}
        </div>

        <div className="mb-2">
            <strong>Адрес:</strong> {otherCompanyPlace.placement}
        </div>

        <div className="mb-3">
            <strong>Координаты:</strong>{" "}
            {`${otherCompanyPlace.x}, ${otherCompanyPlace.y}`}
        </div>

        <div className="mb-3">
            <strong>Вид деятельности:</strong> {otherCompanyPlace.kindActivity}
        </div></>);


    // Показать собственную информацию о точке
    const ShowCurPlace = () =>  { return companyPlace.id !== 0 ? (
        <>
            <div className="mb-2">
                <strong>Названия компании:</strong> {companyPlace.companyName}
            </div>

            <div className="mb-2">
                <strong>Название точки:</strong> {companyPlace.name}
            </div>

            <div className="mb-2">
                <strong>Тип:</strong> {typeCompanyPlaceTo(companyPlace.type,new BaseNameTypeGeoPoint(),"новый вид точки")}
            </div>

            <div className="mb-2">
                <strong>Описание:</strong> {companyPlace.description}
            </div>

            <div className="mb-2">
                <strong>Точка:</strong> {companyPlace.isMain ? "Главная" : "Не главная"}
            </div>

            <div className="mb-2">
                <strong>Адрес:</strong> {companyPlace.placement}
            </div>

            <div className="mb-3">
                <strong>Координаты:</strong>{" "}
                {`${companyPlace.x}, ${companyPlace.y}`}
            </div>

            <div className="d-flex gap-2 mb-2">

                <Button variant="primary"
                        onClick={() => {
                            setShowUpdateParamPlace(true);
                        }}
                        size="sm"
                        className="flex-grow-1">
                    Изменить
                </Button>

                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={async () => {
                        const id = companyPlace.id;
                        // отправляем запрос на удаление и если успешно удаляем с front
                        try {
                            const res = await companyPlaceNode.delete(`/delete-company-place/${id}`);
                            console.log(res);
                            setCompanyPlaces(data.places.filter((e:CompanyPlace) => e.id !== id));
                            setCompanyPlace(prev => ({...prev,id:0}));
                        } catch (e) {
                            console.error(e);
                        } // try-catch
                    }}
                    className="flex-grow-1"
                >
                    Удалить
                </Button>
            </div>
            <div className="d-flex flex-column gap-2">
                <Button onClick={() => {
                    // устанавливаем центр прям на конкретной точке
                    setCenter({x:companyPlace.x,y:companyPlace.y});
                }} variant="info">Перейти к заданной точке</Button>
                <Button onClick={() => {
                    setCenter({x:data?.center?.x,y:data?.center?.y});
                    if (dataCompanies) {
                        setCompanyPlace({
                            id: 0,
                            x: 0,
                            y: 0,
                            isMain: false,
                            name: "",
                            description: "",
                            area: 0,
                            type: TypeCompanyPlace.Office,
                            companyId: dataCompanies[0].id,
                            placement: "",
                            companyName:dataCompanies[0].name
                        });
                    }
                }} variant="danger">Сбросить выбор</Button>
            </div>
        </>
    ) : (<>
        { dataCompanies?.length !== 0 ? (<><div className="text-center text-muted small">
            Выберите точку на карте или создайте ее
        </div>

                <div className="d-flex align-items-center mt-2 gap-2">
                    <OverlayTrigger
                        placement="left"
                        overlay={
                            <Tooltip>
                                  {address === "" ? "Адрес не выбран" : "Адрес - " + address}
                            </Tooltip>
                        }
                    >
                    <Button className="w-100 mt-2"

                variant="outline-success" onClick={() =>
        {
           if(!actionMode.isAction) {
               // устанавливаем режим
               setActionMode({isAction: true, type: "add"});
           } // if
        }}>{actionMode.isAction ? 'Выберите точку на карте' : 'Создать точку'}</Button></OverlayTrigger>
                </div></>)
           : (<>
                <div className="text-center text-muted small">Для создания точки нужна информация про предприятие</div>
                <Button className="w-100 mt-2"
                        variant="outline-success"
                        onClick={() => navigate('/company',{state:{id:0}})}
                >Создать</Button>
            </>)
        }
    </>)};

    // отображения выделенного радиуса
    const ShowCircle = () =>
        <Circle
            geometry={[[analysisPlace.x, analysisPlace.y],
                radius]}

            properties={{
                // Describing the properties of the circle.
                // The contents of the balloon.
                balloonContent: `Радиус круга - ${radius} м`,
            }}
            options={{
                // Fill color. The last byte (77) defines transparency.
                // The transparency of the fill can also be set using
                // the option "fillOpacity".
                fillColor: 'rgba(246,238,240,0.47)',
                // Stroke color.
                strokeColor: '#2c1e22',
                // Stroke transparency.
                strokeOpacity: 0.8,
                // The width of the stroke in pixels.
                strokeWidth: 5,
            }}
        />;


    // если есть множество предприятий у предпринимателя воспроизводим выбор
    return (<>
       <div className="d-flex position-relative">

        <YMaps  query={{
            apikey: "ee6c0339-1297-4cba-9451-5089f67c293a",
            load: "package.full"
        }}>
            <Map
                onLoad={(ref:any) => setMap(ref)}
                onClick={async (e:any) =>  {
                    // берем свойства
                    const {isAction,type} = actionMode;
                    // выбираем точку для создания
                    if(isAction && type === "add") {
                        const place = [e.get("coords")[0],e.get("coords")[1]];
                        // установить центр для фокусировки
                        setCenter({x:place[0],y:place[1]});
                        // устанавили положенное место
                        setPlace({x:place[0],y:place[1]});
                        const obj = await map?.geocode(place);
                        // .then((res: any) => {
                        //                             const first = res.geoObjects.get(0);
                        //                             const address = first.getAddressLine();
                        //                             setAddresses(address)
                        //                         });
                        const first = obj.geoObjects.get(0);
                        const address = first.getAddressLine();
                        setAddresses(address);
                        if(address !== '') {
                            // перенаправление
                            navigate(`/companyPlace/0/companyMapPlaces?x=${place[0]}&y=${place[1]}`);

                        } // if
                        setActionMode(prev => ({...prev,isAction:false}));
                    } // if


                    // если обновления
                    if(isAction && type === "update") {
                        // координаты
                        const coords = [e.get("coords")[0],e.get("coords")[1]];
                        // установить центр для фокусировки
                        setCenter({x:coords[0],y:coords[1]});
                        // для получения адреса
                        const obj = await map?.geocode(coords);
                        const first = obj.geoObjects.get(0);
                        const address = first.getAddressLine();
                        // обработка
                        const res = await companyPlaceNode.put('/short-update-company-place-by-coords',
                                {id:companyPlace.id,coords:coords});
                        if(res.status === 200 && coords[0] && coords[1]) {
                            const index = companyPlaces.findIndex
                            (e => e.id === companyPlace.id);
                            companyPlaces[index].x = coords[0];
                            companyPlaces[index].y = coords[1];
                            companyPlaces[index].placement = address;
                        } // if
                        setActionMode(prev => ({...prev, isAction: false}));
                    } // if

                    // если через некоторое время пользователь не обновил
                    // допустим 5 минут удаляем
                    const id = setTimeout(() =>  setActionMode(prev => ({...prev,isAction:false})),5000);

                    // если режим анализа есть
                    if(analysisPlace.isAnalysis) {
                        const item = {
                            x: e.get("coords")[0],
                            y: e.get("coords")[1], isAnalysis: true
                        };
                        setAnalysisPlace(item);
                        setCenter(item);
                    } // if



                    return () => clearTimeout(id);
                }}
                width="100%"
                height="580px"
                state={{center:[center.x,center.y],zoom:11,controls:[]}}
                defaultState={{ center: [center.x,center.y], zoom: 11,controls:[] }}
                modules={[
                    "control.ZoomControl",
                    "control.GeolocationControl",
                    "control.TypeSelector"
                ]}
            >
                {
                    analysisPlace.isAnalysis
                    && analysisPlace.x !== 0 && analysisPlace.y !== 0 && <ShowCircle/>
                }

                <ZoomControl />

                <GeolocationControl options={{ float: "right" }} />
                <TypeSelector />

                { placemarks  }
                {placemarksOtherCompanies}

            </Map>
        </YMaps>


           <Card
               style={{ width: "30%", maxHeight: "580px" }}
               className="border-0 shadow-sm p-2 ms-2 overflow-auto"
           >

               {/* ===== ЛЕГЕНДА ===== */}
               <Accordion defaultActiveKey="0" className="mb-2">
                   <Accordion.Item eventKey="0">
                       <Accordion.Header>🎨 Легенда</Accordion.Header>

                       <Accordion.Body>
                           <p className="text-muted small text-center">
                               Ориентируйтесь на цвет обводки, цифры значения не имеют
                           </p>

                           <ListGroup variant="flush">
                               <ListGroup.Item className="d-flex align-items-center gap-2">
                                   <Image src="/images/redIcon.png" width={24} />
                                   <span>Склад</span>
                               </ListGroup.Item>

                               <ListGroup.Item className="d-flex align-items-center gap-2">
                                   <Image src="/images/darkOrangeIcon.png" width={24} />
                                   <span>Магазин</span>
                               </ListGroup.Item>

                               <ListGroup.Item className="d-flex align-items-center gap-2">
                                   <Image src="/images/nightIcon.png" width={24} />
                                   <span>Офис</span>
                               </ListGroup.Item>

                               <ListGroup.Item className="d-flex align-items-center gap-2">
                                   <Image src="/images/darkBlueIcon.png" width={24} />
                                   <span>Фабрика</span>
                               </ListGroup.Item>


                               <ListGroup.Item className="d-flex align-items-center gap-2">
                                   <Image src="/images/grayIcon.png" width={24} />
                                   <span>Другие предприятия</span>
                               </ListGroup.Item>
                           </ListGroup>
                       </Accordion.Body>
                   </Accordion.Item>
               </Accordion>

               {/* ===== ФИЛЬТР ===== */}
               { dataCompanies?.length !== 0 && <Accordion className="mb-2">
                   <Accordion.Item eventKey="1">
                       <Accordion.Header>🔍 Фильтр</Accordion.Header>

                       <Accordion.Body>
                           <Form.Label className="small text-muted">По типу точки</Form.Label>
                           <Form.Select
                               className="mb-3"
                               onChange={(e) => {

                                   if(curCompanyId !== 0) {
                                       setCompanyPlaces(data?.places?.filter((item:any) =>
                                            item.type === +e.target.value && item.companyId === curCompanyId));

                                   } else {
                                       setCompanyPlaces(
                                           data?.places?.filter(
                                               (item: any) => item.type === +e.target.value
                                           )
                                       );
                                   } // if
                               }}
                           >
                               <option value="1">Склад</option>
                               <option value="2">Магазин</option>
                               <option value="3">Офис</option>
                               <option value="4">Фабрика</option>
                           </Form.Select>

                           <Form.Label className="small text-muted">Диапазон площади (м²)</Form.Label>

                           <Form.Control
                               value={min}
                               onChange={(e) => setMin(+e.target.value)}
                               type="number"
                               placeholder="Мин площадь (м²)"
                               className="mb-2"
                           />

                           <Form.Control
                               value={max}
                               onChange={(e) => setMax(+e.target.value)}
                               type="number"
                               placeholder="Макс площадь (м²)"
                               className="mb-2"
                           />

                           <Button
                               className="w-100 mb-3"
                               onClick={onClick}
                               variant="primary"
                           >
                               Применить диапазон
                           </Button>

                           { curCompanyId === 0 && <><Form.Label className="small text-muted">По компании</Form.Label>
                           <Form.Select
                               onChange={(e) => {
                                   setCompanyPlaces(
                                       data?.places.filter(
                                           (item: any) => item
                                               .companyId === +e.target.value
                                       )
                                   );
                               }}
                               className="mb-2"
                           >
                               {companiesShow}
                           </Form.Select></>
                       }
                           <Button
                               onClick={defaultFilterClick}
                               className="w-100"
                               variant="outline-success"
                           >
                               Сбросить фильтр
                           </Button>
                       </Accordion.Body>
                   </Accordion.Item>
               </Accordion>
               }
               {/* ===== ИНФОРМАЦИЯ О ТОЧКЕ ===== */}
               <Accordion className="mb-2">
                   <Accordion.Item eventKey="2">
                       <Accordion.Header>📍 Информация о точке</Accordion.Header>

                       <Accordion.Body>
                           {infoOther ? <ShowOtherPlace/> : <ShowCurPlace/>}
                       </Accordion.Body>
                   </Accordion.Item>
               </Accordion>

               {/* ===== аналитика ===== */}
               <Accordion>
                   <Accordion.Item eventKey="2">
                       <Accordion.Header>📊 Аналитика</Accordion.Header>
                       <Accordion.Body>
                           { analysisPlace?.isAnalysis ?
                             <Form.Group className="mb-2">
                                 <Form.Label column="sm" >Выберите радиус:</Form.Label>
                                 <OverlayTrigger
                                     delay={{ show: 250, hide: 400 }}
                                     overlay={<Tooltip>
                                         Радиус {radius} м
                                     </Tooltip>}
                                     placement="top" >
                                 <Form.Range onChange={e => setRadius(+e.target.value)} min="100" step="100" max="10000"/>
                                 </OverlayTrigger>
                                 <div className="d-flex text-muted small justify-content-between">
                                     <p>100</p>
                                     <p>10000</p>
                                 </div>

                                 <div className="mt-2 d-flex flex-column gap-2">
                                      <Button onClick={() => {

                                          setShowTaskAnalysis(true);

                                      }} disabled={analysisPlace.x === 0
                                          || analysisPlace.y === 0} variant="outline-success">Выбрать анализ</Button>
                                      <Button onClick={() => {
                                            setAnalysisPlace({isAnalysis:false,x:0,y:0});
                                      }} variant="outline-danger">Выключить режим анализа</Button>
                                 </div>
                             </Form.Group>
                           : (<>
                               <Button className="w-100" onClick={() => {
                                   if(companyPlace.id === 0) {
                                       handleShow();
                                       setAnalysisPlace({x: 0, y: 0, isAnalysis: true});
                                   } else {
                                       setAnalysisPlace({x:companyPlace.x,y:companyPlace.y,isAnalysis:true});
                                       setDataAnalysis(prev => ({...prev,companyId: companyPlace.companyId}));
                                   } // if

                               }} variant="outline-success">{companyPlace.id === 0 ? "Режим анализа (произвольный)" : "Режим анализа (конкретный)"}</Button>
                                   </>) }
                       </Accordion.Body>
                   </Accordion.Item>
               </Accordion>


           </Card>

       </div>

        {/* Отображения подсказки для уведомления пользователя про включения режима */}
        <Modal show={showAnalysis} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Режим анализа</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                 <h3>Режим анализа включен</h3>
                 <small className="text-muted">Выберите компанию ваших точек</small>
                 <Form.Select onChange={e =>
                     setDataAnalysis(prev => ({...prev,companyId:+e.target.value}))}
                              className="d-flex my-2">
                     {companiesShow}
                 </Form.Select>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between gap-2">
                 <Button onClick={() => {
                       // проверка на то что если пользователь оставил все как есть
                       if(dataAnalysis.companyId === 0) {
                           if (dataCompanies) {
                               setDataAnalysis(prev => ({
                                   ...prev,
                                   companyId: dataCompanies[0].id
                               }));
                           }
                       } // if
                       handleClose();
                 }} variant="outline-success">Принять</Button>
                 <Button onClick={() => {
                     handleClose();
                     setAnalysisPlace(prev => ({...prev,isAnalysis:false}));
                 }} variant="outline-danger">Закрыть</Button>
            </Modal.Footer>
        </Modal>

        {/* Сам выбор */}
        <Modal centered show={showTaskAnalysis} onHide={handleTaskAnalysisClose}>
            <Modal.Header closeButton>
                <Modal.Title>📊 Выбор анализа</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="text-muted small mb-4 text-center">
                    Выберите нужные анализы и нажмите «Проанализировать»
                </p>

                <Row className="g-3">

                    {/* КАРТОЧКА */}
                    <Col md={6}>
                        <div className="p-3 border rounded-4 shadow-sm h-100">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0">Конкуренция</h6>
                                <Form.Check checked={analysis.concurrency} onChange={e =>
                                    setAnalysis(prev => ({...prev,concurrency:e.target.checked}))}  type="switch" />
                            </div>

                            <small className="text-muted">
                                Оценка конкуренции внутри радиуса:
                            </small>

                            <ul className="small mt-2 mb-2">
                                <li>Точки вашей компании</li>
                                <li>Точки конкурентов</li>
                                <li>Точки совпадающее по типу вида деятельности</li>
                            </ul>

                            <small className="text-muted">
                                Чем меньше оценка тем сильнее конкурент способность в заданной области
                            </small>
                        </div>
                    </Col>

                    {/* КАРТОЧКА */}
                    <Col md={6}>
                        <div className="p-3 border rounded-4 shadow-sm h-100">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0">Дистанция</h6>
                                <Form.Check checked={analysis.distance} onChange={e =>
                                    setAnalysis(prev => ({...prev,
                                        distance:e.target.checked}))}  type="switch" />
                            </div>

                            <small className="text-muted">
                                Анализ расстояний:
                            </small>

                            <ul className="small mt-2 mb-2">
                                <li>До своей точки</li>
                                <li>До конкурента</li>
                                <li>До точки с общим типом вида деятельности</li>
                            </ul>

                            <small className="text-muted">
                                Показывает оценку эффективность дистанции в вашей сети предприятия
                            </small>
                        </div>
                    </Col>

                    {/* КАРТОЧКА */}
                    <Col md={6}>
                        <div className="p-3 border rounded-4 shadow-sm h-100">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0">Уникальность</h6>
                                <Form.Check checked={analysis.uniqueness} onChange={e =>
                                    setAnalysis(prev => ({...prev,uniqueness:e.target.checked}))} type="switch" />
                            </div>

                            <small className="text-muted">
                                Проверяет занятость ниши:
                            </small>

                            <p className="small mt-2 mb-2">
                                Чем ниже оценка тем больше таких видов деятельности
                            </p>

                            <small className="text-muted">
                                Помогает найти уникальные точки
                            </small>
                        </div>
                    </Col>

                    {/* КАРТОЧКА */}
                    <Col md={6}>
                        <div className="p-3 border rounded-4 shadow-sm h-100 bg-light">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0">Плотность</h6>
                                <Form.Check checked={analysis.density} onChange={e =>
                                    setAnalysis(prev => ({...prev,density:e.target.checked}))}
                                        type="switch" />
                            </div>

                            <small className="text-muted">
                                Проверяет рынок точек в радиусе:
                            </small>

                            <ul className="small mt-2 mb-2">
                                <li>Точек конкурентов</li>
                                <li>Свои точки</li>
                                <li>С таким же типом вида деятельности</li>
                            </ul>

                            <small className="text-muted">
                                Помогает найти более комфортную зону
                            </small>
                        </div>
                    </Col>
                </Row>
                <div className="p-3 border rounded-4 shadow-sm h-100 bg-light mt-2">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">Общий результат</h6>
                        <Form.Check onChange={e =>
                            setAnalysis(prev => ({...prev,general:e.target.checked}))}type="switch" />
                    </div>

                    <small className="text-muted">
                        Итоговая оценка по всем анализам
                    </small>
                </div>
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
                <Button onClick={async () =>{
                     // получаем центр района или общины
                     const res = await map?.geocode([analysisPlace.x,analysisPlace.y]);

                     if(res) {
                         const obj = res.geoObjects.get(0);
                         const coords: number[] = obj.geometry.getCoordinates();
                         const l_radius = radius;
                         const center = {x:coords[0],y:coords[1]};
                         const place = {x:analysisPlace.x,y:analysisPlace.y};
                         // формируем обьект
                         const all: AnalysisCommon = {
                             param: analysis,
                             data: {center,place,radius:l_radius,
                                 companyId:dataAnalysis.companyId}
                         };
                         // валидация зоны анализа
                          analysisNode.post('/define-analysis-zone',all.data)
                              .then(e => {
                                  // если истино то воспроизводим перенаправление
                                  if(e.data) {
                                      // перенаправление
                                      navigate('/analysis', {state: {all}});

                                  } else {
                                       handleShowErrorZone();

                                       // через некоторое время закрываем
                                      setTimeout(handleCloseErrorZone,1500);
                                  } // if
                              }).catch(console.log);


                     } // if
                }} disabled={!analysis.distance
                    && !analysis.general
                    && !analysis.uniqueness && !analysis.density && !analysis.concurrency} variant="success">
                    🚀 Проанализировать
                </Button>



                <Button variant="outline-secondary" onClick={handleTaskAnalysisClose}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={showErrorZone} >
            <Modal.Header>
                <Modal.Title>Ошибка</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center text-danger">Здесь нет данных для анализа</Modal.Body>

        </Modal>

        <Modal
            centered
            show={showUpdateParamPlace}
            onHide={() => setShowUpdateParamPlace(false)}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title className="fw-semibold">Обновление точки</Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex justify-content-between gap-2">
                 <Button onClick={() => {
                      navigate(`/companyPlace/${companyPlace.id}/companyMapPlaces`);
                 }} variant="outline-info">Обновление параметров</Button>
                 <OverlayTrigger
                     placement="right"
                     delay={{ show: 250, hide: 400 }}
                     overlay={<Tooltip>Модальное окно закроется и вы обязаны будете выбрать точку на карте</Tooltip>}
                 ><Button onClick={() => {
                     setActionMode({isAction:true,type:"update"});
                     setShowUpdateParamPlace(false);
                 }} variant="outline-success">Обновление места (через выбор на карте)</Button>
                 </OverlayTrigger>
            </Modal.Body>
        </Modal>

    </>);
};
export default CompanyMap;