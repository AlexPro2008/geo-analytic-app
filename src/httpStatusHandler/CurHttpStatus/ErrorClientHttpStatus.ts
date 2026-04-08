// Handler обработчик для возвращения 400-х ошибок
import {IHttpStatusHandler} from "../IHttpStatusHandler";

export class ErrorClientHttpStatus implements IHttpStatusHandler {
      // статусы
      readonly statuses:Record<number, string> = {
          400: "Плохой запрос",
          401: "Не авторизован",
          403: "Доступ запрещён",
          404: "Не найдено",
          405: "Метод неверный"
      };

      constructor(public status:number) {
      } // constructor

      // обработка
      handle = ():string => this.statuses[this.status];

} // ErrorClientHttpStatus