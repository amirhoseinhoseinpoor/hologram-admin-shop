import styled from "styled-components";

// Shared top bar of every admin page: menu button, page title / breadcrumb, profile.
export const HeadermakeOrder = styled.div.attrs({
  "data-page-header": "",
})`
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 64px;
  padding: 0 24px;
  margin: 0 calc(-1 * var(--sp-5)) 24px;
  background-color: var(--c-surface);
  border-bottom: 1px solid var(--c-border);

  .textHeaderStyle {
    color: var(--c-ink);
    font-size: 17px;
    font-weight: 600;
    text-decoration: none !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .textHeaderStyle[style*="cursor: pointer"] {
    color: var(--c-muted);
    font-size: 15px;
    font-weight: 500;
    transition: color 0.15s ease;

    &:hover {
      color: var(--c-primary);
    }
  }

  @media (max-width: 768px) {
    margin: 0 calc(-1 * var(--sp-3)) 16px;
    padding: 0 12px;
    min-height: 56px;
    .textHeaderStyle {
      font-size: 15px;
    }
  }
`;

export default HeadermakeOrder;
