import {IHttpStatusHandler} from "../IHttpStatusHandler";
// Обработка серверных ошибок
export class ErrorServerHttpStatus implements IHttpStatusHandler {
     // статусы
     readonly statuses:Record<number, string> = {
         500: "Ошибка сервера",
         502: "Bad Gateway",
         503: "Сервис недоступен",
     };

     // обработка
    constructor(public status:number) {
    } // constructor

    // обработка
    handle = ():string => this.statuses[this.status];
} // ErrorServerHttpStatus