import styled from "styled-components";
import { CircularProgress } from "@mui/material";

const Card = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  padding: 20px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-sm);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .iconBox {
    display: flex;
    flex: 0 0 48px;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    color: var(--c-primary);
    background: var(--c-primary-50);
    border-radius: var(--r-md);

    svg {
      font-size: 26px;
    }
  }

  .label {
    font-size: 13px;
    font-weight: 500;
    color: var(--c-muted);
  }

  .value {
    margin-top: 2px;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.2;
    color: var(--c-ink);
  }

  .error {
    margin-top: 4px;
    font-size: 13px;
    color: var(--c-danger);
  }

  @media (max-width: 768px) {
    padding: 16px;
    .value {
      font-size: 24px;
    }
  }
`;

// value === null / undefined means "still loading".
export default function StatCard({ label, value, icon, error }) {
  return (
    <Card>
      <div className="iconBox">{icon}</div>
      <div>
        <p className="label">{label}</p>
        {error ? (
          <p className="error">{error}</p>
        ) : value === null || value === undefined || value < 0 ? (
          <div className="value">
            <CircularProgress size={22} />
          </div>
        ) : (
          <p className="value">{Number(value).toLocaleString("fa-IR")}</p>
        )}
      </div>
    </Card>
  );
}
