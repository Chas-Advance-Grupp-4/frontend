import { QRCodeProps, QRContainer } from "../../../common/src/components/QRCodeWrapper";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";

export default function QRCodeDisplay({ value, shipment_number, onPrint }: QRCodeProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    if (isPrinting) return;
    setIsPrinting(true);

    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }

    setTimeout(() => setIsPrinting(false), 2000);
  };

  return (
    <div className="w-full">
      <QRContainer title={shipment_number ? `QR Code - ${shipment_number}` : "Parcel QR Code"}>
        <div className="flex flex-col items-center space-y-3 p-3">
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <QRCodeCanvas
              value={value}
              size={160}
              includeMargin={true}
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          {shipment_number && (
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-800 mb-1">{shipment_number}</p>
              <p className="text-xs text-gray-500">Parcel QR Code</p>
            </div>
          )}

          <div className="text-center max-w-full">
            <p className="text-xs text-gray-500 mb-1">QR Data</p>
            <div
              className="bg-gray-100 px-2 py-1 rounded border text-xs font-mono break-all max-w-full"
              style={{ wordBreak: "break-all", maxWidth: "100%" }}
              title={value}
            >
              {value}
            </div>
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={handlePrint}
              className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              {isPrinting ? "Printing..." : "Print"}
            </button>
          </div>
        </div>
      </QRContainer>
    </div>
  );
}