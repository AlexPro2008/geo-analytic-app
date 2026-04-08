// предприятия

import {CompanyPlace} from "./CompanyPlace";

export interface Company {
     id:number,
     name:string,
     description:string
     kindActivityId:number,
     peopleId:number

};


// предприятия
export interface CompanyShow extends Company {
     kindActivity:string,
     description:string,
     placement:string,
     fullname:string,
     count:number
} // CompanyShow

// предприятия + множество гео-точек
export interface CompanyWithPlace extends CompanyShow {
     companyPlaces?:CompanyPlace[]
};

