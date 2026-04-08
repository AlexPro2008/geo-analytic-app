// часть меню
import {NavLink} from "react-router";
// Компонент связаный с перенаправлением
const Item =
    ({path,name,icon}:{path?:string,name?:string,icon?:string}) =>
    (<NavLink style={{textDecoration:"none"}} className={(isActive) =>
        isActive.isActive ? "text-primary" : ""}
              to={path ?? "/"}><i className={`$bi bi-${icon} me-2`}></i>{name ?? "base_name"}</NavLink>);
export default Item;