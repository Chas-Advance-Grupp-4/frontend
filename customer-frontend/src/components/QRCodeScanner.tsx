import { useEffect, useRef, useState, useCallback } from "react";
import { QRScannerProps, QRContainer } from "../../../common/src/components/QRCodeWrapper";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";

export default function QRCodeScanner({ onScan, isActive = true }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const isMountedRef = useRef(true); // Track if component is still mounted

  // Create a stable handleScan that won't change between renders
  const handleScan = useCallback((decodedText: string) => {
    // Only process scan if component is still mounted
    if (!isMountedRef.current) return;
    
    console.log("✅ QR scanned:", decodedText);
    onScan(decodedText);
  }, [onScan]);

  // Cleanup function to properly stop the scanner
  const cleanupScanner = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    console.log("🧹 Cleaning up scanner...");
    try {
      if (scannerRef.current) {
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (error) {
      console.warn("⚠️ Error during scanner cleanup:", error);
    }
  }, []);

useEffect(() => {
  // Only initialize or cleanup based on isActive prop
  if (!isActive) {
    console.log("🔴 Scanner is inactive - cleaning up");
    cleanupScanner();
    return;
  }

  isMountedRef.current = true; // Component mounted
  const elementId = "qr-reader";
  
  // Only initialize if we don't have a scanner already and isActive is true
  if (scannerRef.current) {
    console.log("🔄 Scanner already initialized, skipping...");
    return;
  }

    let scannerInitialized = false;

    const initializeScanner = async () => {
      try {
        console.log("🚀 Initializing QR scanner...");
        
        scannerRef.current = new Html5QrcodeScanner(elementId, {
          fps: 10,
          qrbox: 250,
          rememberLastUsedCamera: true,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        }, true);

        let lastErrorLogTime = 0;

        scannerRef.current.render(
          (decodedText: string) => {
            // Only process if component is still mounted
            if (!isMountedRef.current) return;
            handleScan(decodedText);
          },
          async (err: any) => {
            // Only process errors if component is still mounted
            if (!isMountedRef.current) return;

            if (err?.message?.includes("Error happened while scanning context")) {
              console.error("⛔ Stopping scanner due to camera context error");
              await cleanupScanner();
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

        scannerInitialized = true;

        // Style the upload button after initialization
        setTimeout(() => {
          if (!isMountedRef.current) return;
          
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
        if (!isMountedRef.current) return;
        console.error("🚨 Scanner init error:", e);
        setError(e.message || "Unable to initialize scanner");
      }
    };

    initializeScanner();

    // Cleanup on unmount or when component is no longer needed
    return () => {
      console.log("🧹 useEffect cleanup triggered");
      isMountedRef.current = false;
      
      // Small delay to ensure any pending operations complete
      setTimeout(async () => {
        if (!isMountedRef.current) {
          await cleanupScanner();
        }
      }, 100);
    };
  }, [isActive, handleScan, cleanupScanner]); // run when active flag or handlers change

  // Separate effect for cleaning up when unmounting
  useEffect(() => {
    return () => {
      console.log("🔚 Component unmounting - final cleanup");
      isMountedRef.current = false;
      cleanupScanner();
    };
  }, [cleanupScanner]);

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

