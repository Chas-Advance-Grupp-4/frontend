import { QRCodeProps, QRContainer } from "../../../common/src/components/QRCodeWrapper";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeDisplay({ value }: QRCodeProps) {
  return (
    <QRContainer title="Parcel QR Code">
      <QRCodeCanvas value={value} size={160} includeMargin />
      <p className="mt-2 text-gray-500 text-sm break-all">{value}</p>
    </QRContainer>
  );
}
