// Главный шаблон при отражение на главной странице
import {Outlet} from "react-router";
const MainLayout = () => (<main className="container-fluid"><Outlet/></main>);
export default MainLayout;