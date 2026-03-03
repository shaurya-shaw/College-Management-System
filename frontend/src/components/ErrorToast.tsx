import { useEffect } from "react";

export default function ErrorToast({
  message,
  type = "error",
  onClose,
}: {
  message: string;
  type?: "error" | "success";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white shadow-xl rounded-lg px-4 py-3 max-w-sm
      ${type === "error" ? "border border-red-300" : "border border-green-300"}`}
    >
      <span className={type === "error" ? "text-red-500" : "text-green-500"}>
        {type === "error" ? "⚠" : "✓"}
      </span>
      <span className="text-sm text-gray-700 flex-1 leading-snug">
        {message}
      </span>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 text-xs"
      >
        ✕
      </button>
    </div>
  );
}
