import {AccountStatus} from "./AccountStatus";

export enum StatusResult {
    New, // создана
    Looked,// просмотрена
    Accept, // принята
    Reject // отвергнута
};


export const toStringResult = (status:StatusResult) =>
    status === StatusResult.New ? "Новая"
        : status === StatusResult.Looked ? "Просмотрена"
        : status === StatusResult.Accept ? "Принята"
        : status === StatusResult.Reject ? "Отвергнута"
         : "Статус неизвестен";