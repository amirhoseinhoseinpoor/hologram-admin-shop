import styled from "styled-components";
import MenuIcon from "@mui/icons-material/Menu";

const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  color: var(--c-ink);
  background: transparent;
  border: 1px solid var(--c-border);
  border-radius: var(--r-sm);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background-color: var(--c-primary-50);
    border-color: var(--c-primary-100);
  }
`;

export default function NavBarToggleBurgerButton({ func }) {
  return (
    <MenuButton
      type="button"
      data-plain
      onClick={func}
      aria-label="باز کردن منو"
    >
      <MenuIcon />
    </MenuButton>
  );
}
