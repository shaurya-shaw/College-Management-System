import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useAttendanceStore } from "../../store/attendanceStore";
import ErrorToast from "../../components/ErrorToast";

export function ScanQr() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scanned, setScanned] = useState(false);

  const { scanQrCode, loading, success, error, clearError, clearSuccess } =
    useAttendanceStore();

  // 📍 Get Location
  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => reject(err),
      );
    });
  };

  useEffect(() => {
    const startScanner = async () => {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10 },
        async (decodedText) => {
          if (scanned) return;
          setScanned(true);

          try {
            const location = await getLocation();

            await scanQrCode(decodedText, location.lat, location.lng);

            await scanner.stop();
          } catch (err) {
            console.error(err);
          }
        },
        (errorMessage) => {
          // 🔁 this runs continuously while scanning fails
          console.log("Scanning...", errorMessage);
        },
      );
    };

    startScanner();
    setTimeout(() => {
      const video = document.querySelector("#reader video") as HTMLVideoElement;
      if (video) {
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "cover"; // 🔥 KEY FIX
      }
      const container = document.querySelector("#reader");
      if (container) {
        (container as HTMLElement).style.height = "100%";
      }
    }, 300);

    return () => {
      scannerRef.current?.stop().catch(() => {});
    };
  }, [scanned]);

  return (
    <div className=" bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      {/* Card */}
      <div className="relative w-full max-w-md bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 overflow-hidden">
        {/* Header */}
        <div className="text-center py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Scan Attendance QR
          </h2>
          <p className="text-sm text-gray-500">
            Align QR code inside the frame
          </p>
        </div>

        {/* Camera */}
        <div className="relative w-full aspect-square overflow-hidden bg-black">
          <div id="reader" className="w-full h-full" />

          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Dark mask */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Scan Box */}
            <div className="relative w-64 h-64">
              {/* Corners */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white rounded-br-lg" />

              {/* Scan line */}
              <div className="absolute left-0 w-full h-1 bg-green-400 animate-scan" />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="p-4 text-center">
          {loading && (
            <p className="text-gray-700 text-sm animate-pulse">
              Scanning & marking attendance...
            </p>
          )}

          {success && (
            <ErrorToast
              message={success}
              type="success"
              onClose={clearSuccess}
            />
          )}

          {error && (
            <ErrorToast message={error} type="error" onClose={clearError} />
          )}

          {(success || error) && (
            <button
              onClick={() => {
                clearError();
                clearSuccess();
                setScanned(false);
                window.location.reload();
              }}
              className="mt-3 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition"
            >
              Scan Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
