import styled from "styled-components";

// Search box used above the data tables. Markup: <input.inputSreachStyle/> + <Icon.SearchIconStyle/>
export const SearchInputMainDiv = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;

  .inputSreachStyle {
    width: 100%;
    min-height: var(--control-h);
    padding: 8px 12px 8px 40px;
    font-size: 14px;
    color: var(--c-text);
    background-color: var(--c-surface);
    border: 1px solid var(--c-border-strong);
    border-radius: var(--r-sm);
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;

    &:focus {
      outline: none;
      border-color: var(--c-primary);
      box-shadow: 0 0 0 3px var(--c-primary-100);
    }
  }

  .SearchIconStyle {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    color: var(--c-muted);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    max-width: none;
  }
`;

export default SearchInputMainDiv;
