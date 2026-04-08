// Компонент для отображения в меню
import {Nav} from "react-bootstrap";
import Item from "./Item";

const LinkItem = ({icon,path,name,children}
                  :{icon?:string,path?:string,name?:string,children?:any}) =>
    (<Nav.Item className="mx-2">{icon && <Item icon={icon} path={path} name={name}/> }{children}</Nav.Item>);

export default LinkItem;