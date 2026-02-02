import { useEffect } from "react";

const ToastNotification = ({
  message,
  type = "info",
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-success";
      case "error":
        return "bg-danger";
      case "warning":
        return "bg-warning";
      default:
        return "bg-info";
    }
  };

  if (!message) return null;

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div className={`toast show ${getBgColor()} text-white`} role="alert">
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={onClose}
            aria-label="Close"></button>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;
