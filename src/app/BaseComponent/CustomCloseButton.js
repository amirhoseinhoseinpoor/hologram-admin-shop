export default function CustomCloseButton({ onClick }) {
  return (
    <section>
      <button type="button" onClick={onClick} style={{ background: "none", border: "none" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          fill="white" // Change to your desired color
          viewBox="0 0 25 25"
        >
          <path d="M12 10.585l4.95-4.95.707.707-4.95 4.95 4.95 4.95-.707.707L12 12.414l-4.95 4.95-.707-.707 4.95-4.95-4.95-4.95.707-.707z" />
        </svg>
      </button>
    </section>
  );
}
