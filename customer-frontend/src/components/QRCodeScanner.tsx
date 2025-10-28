import { useEffect, useRef, useState, useCallback } from "react";
import { QRScannerProps, QRContainer } from "../../../common/src/components/QRCodeWrapper";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";

export default function QRCodeScanner({ onScan }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleScan = useCallback((decodedText: string) => {
    console.log("✅ QR scanned:", decodedText);
    onScan(decodedText);
  }, [onScan]);

  useEffect(() => {
    const elementId = "qr-reader";
    if (scannerRef.current) return;

    try {
      scannerRef.current = new Html5QrcodeScanner(elementId, {
        fps: 10,
        qrbox: 250,
        rememberLastUsedCamera: true,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      }, true);

      let lastErrorLogTime = 0;

      scannerRef.current.render(
        handleScan,
        async (err: any) => {
          if (err?.message?.includes("Error happened while scanning context")) {
            console.error("⛔ Stopping scanner due to camera context error");
            try {
              await scannerRef.current?.clear();
            } catch (_) {}
            return;
          }

          const now = Date.now();
          if (now - lastErrorLogTime > 2000) {
            if (!err.message?.includes("NotFoundException")) {
              console.warn("⚠️ QR scan error:", err);
              setError(err.message);
            }
            lastErrorLogTime = now;
          }
        }
      );

      setTimeout(() => {
        const uploadBtn = document.querySelector(
          ".html5-qrcode-button-file-selection"
        ) as HTMLElement;
        if (uploadBtn) {
          uploadBtn.style.display = "inline-block";
          uploadBtn.style.marginTop = "12px";
          uploadBtn.style.background = "#2563eb"; // Tailwind blue-600
          uploadBtn.style.color = "white";
          uploadBtn.style.padding = "8px 12px";
          uploadBtn.style.borderRadius = "8px";
          uploadBtn.style.cursor = "pointer";
          uploadBtn.style.border = "none";
        }
      }, 600);
    } catch (e: any) {
      console.error("🚨 Scanner init error:", e);
      setError(e.message || "Unable to initialize scanner");
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [handleScan]);

  return (
    <QRContainer title="Scan a Parcel">
      <div
        style={{
          width: "320px",         // fixed width
          height: "320px",        // fixed height
          maxWidth: "90vw",       // responsive for small screens
          borderRadius: "1rem",
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <div id="qr-reader" style={{ width: "100%", height: "100%" }} />
      </div>
      {permissionDenied && (
        <p className="text-yellow-600 text-sm mt-2">
          Camera access denied. Please allow camera permissions to scan a parcel.
        </p>
      )}
      {error && !permissionDenied && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </QRContainer>
  );
}