// Перечисления
import {TypeCompanyPlaceName} from "./interfaces/TypeCompanyPlaceName";

export enum TypeCompanyPlace {
    Warehouse = 1, // точка скопления
    Store = 2, // точка продажи
    Office = 3, // точка поддержки
    Factory = 4,// точка сбыта и контроля подобие фабрики
};


//Тип точки	Пресет
//Магазин	islands#redShoppingIcon
// Склад	islands#blueWarehouseIcon
// Офис	islands#grayOfficeIcon
// Фабрика	islands#greenFactoryIcon
// По умолчанию	islands#blueDotIcon

// Перевод в что то
export const typeCompanyPlaceTo =
    (type:TypeCompanyPlace, names:TypeCompanyPlaceName, def:string):string =>
        names.names[type] ?? def;



// Перевод в цвет
export const typeCompanyPlaceToVariant = (type:TypeCompanyPlace)
    :string =>
        type === TypeCompanyPlace.Warehouse
            ? "secondary" : type === TypeCompanyPlace.Store
                ? "primary" : type === TypeCompanyPlace.Office ? "success" : "info";