import {Alert} from "react-bootstrap";

const SuccessAlert = ({name}:{name:string}) =>
    <Alert variant="success" className={"d-flex justify-content-center text-center my-2"}>{name}</Alert>
export default SuccessAlert;