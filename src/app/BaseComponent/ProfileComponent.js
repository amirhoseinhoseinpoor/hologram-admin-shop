import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { NavDropdown } from "react-bootstrap";
import styled from "styled-components";
// import redux
import { useSelector , useDispatch } from "react-redux";
import { firstName, lastName, phoneNumber } from "../Store/slice";
import { resetToken } from "../Store/slice";

const NavDropDown = styled(NavDropdown)`
  .dropdown-menu {
    border: 1px solid gray;
    width: 230px;
    padding: 12px;
    margin-top: 3px;
    border-radius: 4px;
    box-shadow: 1px 1px 5px gray;
  }
`;

const NavBarInsideDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1.4px solid #e1e5ea;
`;

const ExitButton = styled.button`
 margin-top: 7px;
  background-color: transparent;
  color: red !important;
  padding: 5px 10px !important;
  border: none;
  border-radius: 4px;
  width: fit-content;
`;

export default function ProfileComponent({ colorGet, backgroundImage }) {

  const dispatch = useDispatch();

  const firstNameU = useSelector(firstName);
  const lastNameU = useSelector(lastName);
  const phoneNumberU = useSelector(phoneNumber);

  const handleResetToken = () => {
    dispatch(resetToken());
  };

  return (
    <>
      <NavDropDown
        title={
          <>
            <AccountCircleOutlinedIcon
              style={{
                color: colorGet || "unset",
                backgroundImage: backgroundImage || "unset",
                cursor: "pointer",
                fontSize: "28px",
              }}
            />
          </>
        }
        id="basic-nav-dropdown"
      >
        <NavBarInsideDiv>
          <p className="VodeoDisSizing mb-2 text-end">
            {firstNameU} {lastNameU}
          </p>
          <p className="discription text-end">{phoneNumberU}</p>
        </NavBarInsideDiv>
        <div className="d-flex justify-content-end">
          <ExitButton onClick={handleResetToken} type="button">
            خروج
          </ExitButton>
        </div>
      </NavDropDown>
    </>
  );
}
