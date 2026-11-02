import styled, { css } from "styled-components";

// Shared buttons of the admin panel. Use these instead of one-off styled buttons.
const base = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 18px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: var(--r-sm);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;

  svg {
    font-size: 20px;
  }

  &:focus-visible {
    outline: 3px solid var(--c-primary-100);
    outline-offset: 1px;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled.button.attrs((p) => ({
  type: p.type || "button",
}))`
  ${base}
  color: #fff !important;
  background-color: var(--c-primary) !important;
  border-color: var(--c-primary) !important;
  box-shadow: var(--shadow-sm);

  &:hover:not(:disabled) {
    background-color: var(--c-primary-600) !important;
    border-color: var(--c-primary-600) !important;
  }
`;

export const SecondaryButton = styled.button.attrs((p) => ({
  type: p.type || "button",
}))`
  ${base}
  font-weight: 500;
  color: var(--c-text) !important;
  background-color: var(--c-surface) !important;
  border-color: var(--c-border-strong) !important;

  &:hover:not(:disabled) {
    background-color: #f3f4f6 !important;
  }
`;

export const DangerButton = styled.button.attrs((p) => ({
  type: p.type || "button",
}))`
  ${base}
  color: #fff !important;
  background-color: var(--c-danger) !important;
  border-color: var(--c-danger) !important;

  &:hover:not(:disabled) {
    background-color: var(--c-danger-600) !important;
  }
`;

export const IconButton = styled.button.attrs((p) => ({
  type: p.type || "button",
  "data-plain": "",
}))`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  color: var(--c-muted);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--r-sm);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    color: var(--c-ink);
    background-color: #f3f4f6;
  }
`;
