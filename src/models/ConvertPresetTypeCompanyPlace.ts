import {TypeCompanyPlaceName} from "./interfaces/TypeCompanyPlaceName";
import {TypeCompanyPlace} from "./TypeCompanyPlace";

export class ConvertPresetTypeCompanyPlace implements TypeCompanyPlaceName {
    readonly names:Record<TypeCompanyPlace, string> = {
        [TypeCompanyPlace.Factory]:"islands#darkBlueDotIcon",
        [TypeCompanyPlace.Office]: "islands#nightDotIcon",
        [TypeCompanyPlace.Store] : "islands#darkOrangeDotIcon",
        [TypeCompanyPlace.Warehouse]:"islands#redDotIcon"
    };
}