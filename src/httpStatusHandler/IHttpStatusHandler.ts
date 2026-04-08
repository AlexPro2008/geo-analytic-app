// Интерфейс для реализации по статусам
import {IHttpHandler} from "./IHttpHandler";

export interface IHttpStatusHandler extends IHttpHandler {
     readonly statuses:Record<number,string>,
     handle():string;
} // IHttpStatusHandler