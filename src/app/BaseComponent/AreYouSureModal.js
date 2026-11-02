import { Modal, Box, CircularProgress } from "@mui/material";
import ModalIcon from "./ModalIcon";
import { modalStyle, ModalText, ModalButtons } from "./modalStyles";

// Deleting is destructive, so those dialogs get a red confirm button.
const isDestructive = (text) =>
  typeof text === "string" && text.includes("حذف");

export default function AreYouShureModal({
  open,
  onClose,
  text,
  func,
  loading = false,
  confirmText = "تایید",
  cancelText = "انصراف",
  variant,
}) {
  const danger =
    (variant ?? (isDestructive(text) ? "danger" : "primary")) === "danger";

  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      aria-labelledby="confirm-modal-text"
    >
      <Box sx={modalStyle}>
        <ModalIcon type={danger ? "danger" : "warning"} />

        <ModalText id="confirm-modal-text">{text}</ModalText>

        <ModalButtons>
          <button
            type="button"
            className={danger ? "modalDanger" : "modalConfirm"}
            onClick={func}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              confirmText
            )}
          </button>
          <button
            type="button"
            className="modalCancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
        </ModalButtons>
      </Box>
    </Modal>
  );
}
