// Гео точка
import {TypeCompanyPlace} from "../TypeCompanyPlace";


// базовое представление гео-точки
export interface CompanyPlace {
    // ИД
    id:number
    // название метки
    name:string,
    // описание каждой метки
    description?:string,
    // главная ли точка
    isMain:boolean,
    // геометрически координаты
    x:number
    y:number
   // площадь распространения
    area:number
   // тип
    type:TypeCompanyPlace,
    // ид точки предприятия
    companyId:number
    // адрес
    placement:string
};
export interface CompanyPlaceInfoCompany extends CompanyPlace {
    companyName:string
};



