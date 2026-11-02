import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: 100%;
  min-height: 60vh;
  color: var(--c-muted);

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--c-primary-100);
    border-top-color: var(--c-primary);
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }
  p {
    font-size: 14px;
  }
`;

export default function SoftLoader() {
  return (
    <Wrap role="status" aria-live="polite">
      <div className="spinner" />
      <p>در حال بارگذاری...</p>
    </Wrap>
  );
}
