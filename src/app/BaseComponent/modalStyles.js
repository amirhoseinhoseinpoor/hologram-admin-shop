import styled from "styled-components";

// Shared look for every confirm / success / error dialog.
export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(400px, calc(100vw - 32px))",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 3, sm: 4 },
  borderRadius: "16px",
  outline: "none",
  direction: "rtl",
  textAlign: "center",
};

export const ModalText = styled.p`
  margin: 16px 0 0;
  font-size: 16px;
  line-height: 1.9;
  color: #2b2f3a;
  word-break: break-word;
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;

  button {
    flex: 1;
    min-height: 42px;
    padding: 8px 14px;
    border-radius: var(--r-sm);
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 160ms ease,
      transform 160ms ease,
      opacity 160ms ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  button:not(:disabled):hover {
    transform: translateY(-1px);
  }

  .modalConfirm {
    border: none;
    background: var(--c-primary);
    color: #fff;
  }
  .modalConfirm:not(:disabled):hover {
    background: var(--c-primary-600);
  }

  .modalDanger {
    border: none;
    background: var(--c-danger);
    color: #fff;
  }
  .modalDanger:not(:disabled):hover {
    background: #b91c1c;
  }

  .modalCancel {
    border: 1px solid var(--c-border-strong);
    background: var(--c-surface);
    color: var(--c-text);
  }
  .modalCancel:not(:disabled):hover {
    background: #f3f4f6;
  }
`;
