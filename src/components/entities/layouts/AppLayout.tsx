import Header from "../header/Header";
import {Outlet, useNavigate} from "react-router";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux";

// Шаблон для карт и так далее
const AppLayout = () => {
        return <>
                <Header/>
                <main className="container-fluid flex-grow-1"><Outlet/></main>
                <footer className="border-top p-3 text-muted text-center ">
                        <div className="container-fluid">
                                &copy; 2026 - GeoAnalyticApp - Ясько Александр
                        </div>
                </footer>
        </>;
}
export default AppLayout;
