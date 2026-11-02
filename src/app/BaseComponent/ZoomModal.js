import { Modal, Box } from "@mui/material";
import styled from "styled-components";

const ModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "12px",
  maxWidth: "92vw",
  maxHeight: "90vh",
  objectFit: "contain",
  outline: "none",
  boxShadow: 24,
  p: 0,
};

const BOXSTYLE = styled(Box)`
  width: 600px;

  @media (max-width: 980px) {
    width: 500px;
  }

  @media (max-width: 768px) {
    width: 350px;
  }
`;

export default function ZoomModal({ open, onClose, src, alt }) {
  return (
    <section>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title2"
        aria-describedby="modal-modal-description2"
      >
        <BOXSTYLE
          component="img"
          src={src}
          alt={alt}
          sx={ModalStyle}
        ></BOXSTYLE>
      </Modal>
    </section>
  );
}
