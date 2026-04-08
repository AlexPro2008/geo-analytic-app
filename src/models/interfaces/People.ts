// тип для регистрации и разные других целей
export type People = {
    id:number,
    surname:string,
    name:string,
    patronymic:string,
    number:string,
    passport:string,
    path:string,
    gender:number,
    username:string,
    password:string,
    email:string
};

// для отправления post
export type PeopleSend = Pick<People,"id" | "surname" |
    "name" | "patronymic" |"number" | "passport" | "path" | "gender">;

export type PeoplePanel = Pick<People,"surname"| "name"|"patronymic">;