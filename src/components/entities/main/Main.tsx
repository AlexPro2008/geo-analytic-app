import {Row,Col} from "react-bootstrap";
import Entry from "../../auth/Entry";
import Text from "./Text";
// компонент для отображения главной страницы
const Main = () => (<>
        <Row>
            <Col><Entry/></Col>
            <Col><Text/></Col>
        </Row>
</>);
export default Main;