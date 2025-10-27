import { useEffect, useRef, useState } from "react";
import { QRScannerProps, QRContainer } from "../../../common/src/components/QRCodeWrapper";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";

export default function QRCodeScanner({ onScan }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // ID of the div where scanner will render
    const elementId = "qr-reader";

    try {
      scannerRef.current = new Html5QrcodeScanner(elementId, {
        fps: 10,
        qrbox: 250,
        rememberLastUsedCamera: true,
        // supported scan types
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      },
        false
    );

      scannerRef.current.render(
        (decodedText: string) => {
          console.log("QR scanned:", decodedText);
          onScan(decodedText); // raw QR string (URL or shipment ID)
        },
        (err: any) => {
          if (!err.message.includes("NotFoundException")) {
            console.warn("QR scan error:", err);
            setError(err.message);
          }
        }
      );
    } catch (e: any) {
      console.error("Scanner init error:", e);
      setError(e.message || "Unable to initialize scanner");
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <QRContainer title="Scan a Parcel">
      <div id="qr-reader" style={{ width: "100%" }} />
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
