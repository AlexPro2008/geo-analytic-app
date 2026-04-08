// полное меню
import {Container, DropdownDivider, Image, Nav, Navbar, NavDropdown, OverlayTrigger, Tooltip} from "react-bootstrap";
import LinkItem from "./LinkItem";
import {NavLink} from "react-router";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux";



const Header = () => (<>
     <Navbar bg="grey" expand={true}>
         <Container fluid={true}>
              <Navbar.Brand><LinkItem icon="map" path="companyMapPlaces" name="Главная"/></Navbar.Brand>
             <LinkItem icon="bar-chart" path="/analysis" name="Аналитика"/>
             <LinkItem icon="patch-check" path="/recommendations" name="Рекомендации"/>
             <LinkItem icon="briefcase" path="/companies" name="Предприятия"/>
             <LinkItem icon="geo-alt" path="/companyPlaces" name="Места"/>
             <LinkItem icon="bookmark-plus" path="/tasks" name="Задачи"/>

                           <Navbar className="ms-auto">
                    <LinkItem path={`profile/${useSelector((e:RootState) => e.account).peopleId}`}
                              name="Профиль"
                              icon="person"
                    ></LinkItem>

                    <LinkItem path="/"
                                 name="Выйти"
                              icon="box-arrow-right"/>

              </Navbar>
         </Container>
     </Navbar>
</>);

export default Header;

