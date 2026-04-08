import {TypeCompanyPlace} from "./TypeCompanyPlace";
import {TypeCompanyPlaceName} from "./interfaces/TypeCompanyPlaceName";
// Абстрактное базовое название точек
// словарь
export class BaseNameTypeGeoPoint implements TypeCompanyPlaceName {
     readonly names:Record<TypeCompanyPlace, string> = {
        [TypeCompanyPlace.Factory]:"Фабрика",
        [TypeCompanyPlace.Office]: "Офис",
        [TypeCompanyPlace.Store] : "Магазин",
        [TypeCompanyPlace.Warehouse]:"Склад"
    };
} // BaseNameTypeGeoPoint



