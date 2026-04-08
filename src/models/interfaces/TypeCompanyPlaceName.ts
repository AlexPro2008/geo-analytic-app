// интерфейс для замены названий точек
import {TypeCompanyPlace} from "../TypeCompanyPlace";

export interface TypeCompanyPlaceName {
       readonly names:Record<TypeCompanyPlace,string>
};