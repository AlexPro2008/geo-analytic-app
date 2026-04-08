// Тип для аутенфикации
import {People} from "./interfaces/People";

export type Auth = Pick<People,"username" | "password">

