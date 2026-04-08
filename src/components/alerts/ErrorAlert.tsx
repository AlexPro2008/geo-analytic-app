import {Alert} from "react-bootstrap";
// alert по ошибочному статусу
const ErrorAlert = ({name}:{name:string}) => <Alert variant="danger"
                                className={"d-flex justify-content-center text-center my-2"}>{name}</Alert>;
export default ErrorAlert