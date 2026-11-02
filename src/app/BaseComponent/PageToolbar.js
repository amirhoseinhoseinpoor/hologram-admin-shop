import styled from "styled-components";

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;

  .titles {
    min-width: 0;
  }
  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: var(--c-ink);
  }
  .meta {
    margin-top: 4px;
    font-size: 13px;
    color: var(--c-muted);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  @media (max-width: 576px) {
    .actions {
      width: 100%;
    }
    .actions > * {
      flex: 1;
    }
  }
`;

// Title row above a list: "عنوان / n مورد" on one side, actions on the other.
export default function PageToolbar({ title, count, loading, children }) {
  return (
    <Bar>
      <div className="titles">
        <h2>{title}</h2>
        {!loading && typeof count === "number" && (
          <p className="meta">
            {count.toLocaleString("fa-IR")} مورد
          </p>
        )}
      </div>
      <div className="actions">{children}</div>
    </Bar>
  );
}
