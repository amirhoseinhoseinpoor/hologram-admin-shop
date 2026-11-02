import { Modal, Box } from "@mui/material";
import ModalIcon from "./ModalIcon";
import { modalStyle, ModalText, ModalButtons } from "./modalStyles";

export default function ErrorModal({
  open,
  onClose,
  text = "خطا در انجام عملیات، لطفاً دوباره تلاش کنید",
  closeText = "بستن",
}) {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="error-modal-text">
      <Box sx={modalStyle}>
        <ModalIcon type="error" />

        <ModalText id="error-modal-text">{text}</ModalText>

        <ModalButtons>
          <button type="button" className="modalCancel" onClick={onClose}>
            {closeText}
          </button>
        </ModalButtons>
      </Box>
    </Modal>
  );
}
