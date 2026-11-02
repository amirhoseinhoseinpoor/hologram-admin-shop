import { Dropdown } from "react-bootstrap";
import styled from "styled-components";
import LogoutIcon from "@mui/icons-material/Logout";
// import redux
import { useSelector, useDispatch } from "react-redux";
import { firstName, lastName, phoneNumber, resetToken } from "../Store/slice";

const Toggle = styled(Dropdown.Toggle)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 4px 4px 4px 10px;
  color: var(--c-ink);
  background: transparent;
  border: 1px solid var(--c-border);
  border-radius: 999px;

  &::after {
    display: none;
  }
  &:hover,
  &:focus,
  &.show,
  &:active {
    color: var(--c-ink) !important;
    background-color: var(--c-primary-50) !important;
    border-color: var(--c-primary-100) !important;
  }
`;

const Avatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background-color: var(--c-primary);
  border-radius: 50%;
`;

const Name = styled.span`
  max-width: 140px;
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Menu = styled(Dropdown.Menu)`
  min-width: 220px;
`;

const Info = styled.div`
  padding: 8px 12px 10px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--c-border);

  .fullName {
    margin-bottom: 2px;
    font-size: 14px;
    font-weight: 600;
    color: var(--c-ink);
  }
  .phone {
    font-size: 13px;
    color: var(--c-muted);
    direction: ltr;
    text-align: right;
  }
`;

const ExitItem = styled(Dropdown.Item)`
  display: flex !important;
  align-items: center;
  justify-content: flex-start !important;
  gap: 10px;
  width: 100%;
  min-height: 40px;
  padding: 0 12px !important;
  font-size: 14px;
  font-weight: 500;
  color: var(--c-danger) !important;
  background-color: transparent !important;
  border: none !important;
  border-radius: var(--r-sm);
  cursor: pointer;
  transition: background-color 0.15s ease;

  svg {
    font-size: 20px;
  }

  &:hover,
  &:focus,
  &:active {
    color: var(--c-danger-600) !important;
    background-color: var(--c-danger-50) !important;
  }
`;

export default function ProfileComponent() {
  const dispatch = useDispatch();

  const firstNameU = useSelector(firstName);
  const lastNameU = useSelector(lastName);
  const phoneNumberU = useSelector(phoneNumber);

  const fullName = [firstNameU, lastNameU].filter(Boolean).join(" ");
  const initial = (fullName || "ا").trim().charAt(0);

  const handleResetToken = () => {
    dispatch(resetToken());
  };

  return (
    <Dropdown align="end">
      <Toggle
        id="profile-dropdown"
        variant="light"
        data-plain
        aria-label="حساب کاربری"
      >
        <Name>{fullName || "مدیر سیستم"}</Name>
        <Avatar>{initial}</Avatar>
      </Toggle>
      <Menu>
        <Info>
          <p className="fullName">{fullName || "مدیر سیستم"}</p>
          <p className="phone">{phoneNumberU}</p>
        </Info>
        <ExitItem
          as="button"
          type="button"
          data-plain
          onClick={handleResetToken}
        >
          <LogoutIcon fontSize="small" />
          خروج از حساب
        </ExitItem>
      </Menu>
    </Dropdown>
  );
}
