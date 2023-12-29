import { Modal, Button } from "react-bootstrap";
import { deleteUser } from "../services/UserService";
import { toast } from "react-toastify";

const ModalConfirm = (props) => {
  const { show, handleClose, dataUserDelete, handleDeleteUserFromModal } =
    props;

  const confirmDelete = async () => {
    let res = await deleteUser(dataUserDelete.id);
    //dùng dấu cộng truoc (+res.statusCode) để trong trường hợp res.statusCode trả về một chuỗi String
    //thì sẽ convert nó sang kiểu số nguyên. Đảm bảo ==== 204 luôn đúng.
    if (res && +res.statusCode === 204) {
      toast.success("Delete user successfully");
      handleClose();
      handleDeleteUserFromModal(dataUserDelete);
    } else {
      toast.error("Error deleting user");
    }
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete a user: </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h6>This action cant't be undone!</h6>
            Do want to delete this user, <b>email = {dataUserDelete.email} ?</b>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => confirmDelete()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalConfirm;
