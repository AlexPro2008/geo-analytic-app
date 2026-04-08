import {StatusResult} from "../enums/StatusResult";

export interface Support {
       id:number,
       email:string,
       theme:string,
       description:string,
       status:StatusResult,
       createdAt:string
};