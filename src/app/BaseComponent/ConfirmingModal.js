import { Modal, Box } from "@mui/material";
import ModalIcon from "./ModalIcon";
import { modalStyle, ModalText, ModalButtons } from "./modalStyles";

export default function ConfirmingModal({
  open,
  onClose,
  text = "عملیات با موفقیت انجام شد",
  closeText = "بستن",
}) {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="success-modal-text">
      <Box sx={modalStyle}>
        <ModalIcon type="success" />

        <ModalText id="success-modal-text">{text}</ModalText>

        <ModalButtons>
          <button type="button" className="modalConfirm" onClick={onClose}>
            {closeText}
          </button>
        </ModalButtons>
      </Box>
    </Modal>
  );
}
