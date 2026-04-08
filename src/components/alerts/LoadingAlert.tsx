import {Alert} from "react-bootstrap";

const LoadingAlert = ({name}:{name:string}) =>
     <Alert variant="warning" className={"d-flex justify-content-center text-center my-2"}>{name}</Alert>
export default LoadingAlert;
