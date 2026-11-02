import styled from "styled-components";

const CloseBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
`;

export default function CustomCloseButton({
  onClick,
  background,
  border,
  color,
}) {
  return (
    <section>
      <CloseBtn
        type="button"
        data-plain
        aria-label="بستن"
        onClick={onClick}
        style={{ background: background || "none", border: border || "none" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="27"
          height="27"
          style={{ fill: color || "currentColor" }}
          viewBox="0 0 25 25"
        >
          <path d="M12 10.585l4.95-4.95.707.707-4.95 4.95 4.95 4.95-.707.707L12 12.414l-4.95 4.95-.707-.707 4.95-4.95-4.95-4.95.707-.707z" />
        </svg>
      </CloseBtn>
    </section>
  );
}
