export default function SoftLoader() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        background: "rgba(0,0,0,0.03)",
        borderRadius: "16px",
        animation: "pulse 1.5s infinite",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "4px solid #ccc",
          borderTopColor: "#555",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }}
      ></div>

      <p style={{ fontSize: "1.1rem", opacity: 0.7 }}>در حال بارگذاری...</p>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
