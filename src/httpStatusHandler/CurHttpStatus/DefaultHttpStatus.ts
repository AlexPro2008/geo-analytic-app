// Статус неизвестный
import {IHttpStatusHandler} from "../IHttpStatusHandler";
import {number, string} from "yup";
import {IHttpHandler} from "../IHttpHandler";

export class DefaultHttpStatus implements IHttpHandler {

       handle(): string {
           return "Статус неизвестный";
       } // handle
} // DefaultHttpStatus
