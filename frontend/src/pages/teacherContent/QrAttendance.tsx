import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAttendanceStore } from "../../store/attendanceStore";
import { QRCodeCanvas } from "qrcode.react";
import ErrorToast from "../../components/ErrorToast";

const QrAttendance = () => {
  const { classId } = useParams();

  const {
    token,
    generateQrCode,
    loading,
    error,
    success,
    clearError,
    clearSuccess,
  } = useAttendanceStore();

  useEffect(() => {
    if (classId) {
      generateQrCode(classId, new Date("2026-03-27"));

      const interval = setInterval(() => {
        generateQrCode(classId, new Date("2026-03-27"));
      }, 60000); // refresh every 1 min

      return () => clearInterval(interval);
    }
  }, [classId]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-xl font-semibold mb-4 border-2 border-gray-500/25 rounded-2xl p-2">
        Scan for Attendance
      </h1>

      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

      {token && (
        <QRCodeCanvas
          value={token}
          size={440}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      )}

      {error && (
        <ErrorToast message={error} type="error" onClose={clearError} />
      )}
      {success && (
        <ErrorToast message={success} type="success" onClose={clearSuccess} />
      )}
    </div>
  );
};

export default QrAttendance;
