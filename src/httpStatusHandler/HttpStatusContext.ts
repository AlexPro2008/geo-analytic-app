// обработка самих статусов

import {IHttpHandler} from "./IHttpHandler";
import {SuccessHttpStatus} from "./CurHttpStatus/SuccessHttpStatus";
import {ErrorClientHttpStatus} from "./CurHttpStatus/ErrorClientHttpStatus";
import {ErrorServerHttpStatus} from "./CurHttpStatus/ErrorServerHttpStatus";
import {DefaultHttpStatus} from "./CurHttpStatus/DefaultHttpStatus";
import {IHttpStatusHandler} from "./IHttpStatusHandler";

export class HttpStatusContext {

      constructor(public handler:IHttpHandler) {

      } // constructor

} // HttpStatusContext


// обработчик который текст сообщения
export const handleStatus = (status:number):IHttpHandler => {
    const number = Math.floor(status / 100);
    return number === 2 ? new SuccessHttpStatus(status) :
        number === 4 ? new ErrorClientHttpStatus(status) :
            number === 5 ? new ErrorServerHttpStatus(status) :
                new DefaultHttpStatus();
} // handle
