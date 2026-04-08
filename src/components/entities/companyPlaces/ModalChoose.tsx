// компонент для выбора ввода адреса при изменение
import {Button, Modal} from "react-bootstrap";

const ModalChoose = ({show,onClose,
                         input,map}:{show:boolean,onClose:any,input:any,map:any}) => {

    return (<>
        <Modal className="w-50" show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">
                    Способ указания адреса
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="text-muted mb-4">
                    Выберите удобный способ добавления адреса для точки.
                </p>

                <div className="d-grid gap-3">
                    <Button
                        onClick={input}
                        variant="outline-primary"
                        className="d-flex align-items-center justify-content-between p-3"
                    >
        <span>
          ✏️ <strong>Ввести вручную</strong>
          <div className="small text-muted">
            Подходит для точного ввода известного адреса
          </div>
        </span>
                    </Button>

                    <Button
                        onClick={map}
                        variant="primary"
                        className="d-flex align-items-center justify-content-between p-3"
                    >
        <span>
          🗺 <strong>Выбрать на карте</strong>
          <div className="small opacity-75">
            Укажите точку кликом по карте
          </div>
        </span>
                    </Button>
                </div>
            </Modal.Body>

            <Modal.Footer className="justify-content-end">
                <Button onClick={onClose} variant="outline-secondary">
                    Отмена
                </Button>
            </Modal.Footer>
        </Modal>

    </>);
};
export default ModalChoose;