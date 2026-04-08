// Успешный ответ
import {IHttpStatusHandler} from "../IHttpStatusHandler";
import {number, string} from "yup";

export class SuccessHttpStatus implements IHttpStatusHandler {

      // словарь статусов 200
      readonly statuses:Record<number, string> = {
            200: "Успешно",
            201: "Создано",
      };

      constructor(public status:number) {
      } // constructor

      // обработка
      handle = ():string => this.statuses[this.status];
};