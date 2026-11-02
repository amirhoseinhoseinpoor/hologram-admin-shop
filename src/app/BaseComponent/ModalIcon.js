import styled, { keyframes } from "styled-components";

const COLORS = {
  warning: { fg: "#f59e0b", bg: "#fef3c7" },
  danger: { fg: "#ef4444", bg: "#fee2e2" },
  success: { fg: "#22c55e", bg: "#dcfce7" },
  error: { fg: "#ef4444", bg: "#fee2e2" },
};

const pop = keyframes`
  0% { transform: scale(0.6); opacity: 0; }
  70% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const draw = keyframes`
  to { stroke-dashoffset: 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 76px;
  margin: 0 auto;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  animation: ${pop} 0.45s ease-out both;

  svg {
    width: 40px;
    height: 40px;
    fill: none;
    stroke: ${({ $fg }) => $fg};
    stroke-width: 3.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .draw {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: ${draw} 0.4s ease-out 0.25s forwards;
  }

  .fade {
    opacity: 0;
    animation: ${fadeIn} 0.3s ease-out 0.25s forwards;
  }
`;

const PATHS = {
  success: <path className="draw" d="M8 21 l8 8 l16 -17" />,
  error: (
    <>
      <path className="draw" d="M11 11 L29 29" />
      <path className="draw" d="M29 11 L11 29" />
    </>
  ),
  warning: (
    <>
      <path className="fade" d="M20 10 V23" />
      <path className="fade" d="M20 30 V30.5" />
    </>
  ),
};

export default function ModalIcon({ type = "warning" }) {
  const c = COLORS[type] || COLORS.warning;
  const key = type === "danger" ? "warning" : type;
  return (
    <Wrapper $fg={c.fg} $bg={c.bg} aria-hidden="true">
      <svg viewBox="0 0 40 40">{PATHS[key]}</svg>
    </Wrapper>
  );
}
