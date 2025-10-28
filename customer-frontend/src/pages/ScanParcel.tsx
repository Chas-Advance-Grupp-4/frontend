import { useNavigate } from "react-router-dom";
import QRCodeScanner from "../components/QRCodeScanner";

export default function ScanParcel() {
  const navigate = useNavigate();

  const handleScan = (value: string) => {
    console.log("Scanned:", value);
    const id = value.split("/parcel/")[1];
    if (id) navigate(`/parcel/${id}`);
  };

  return (
    <div className="p-4">
      <QRCodeScanner onScan={handleScan} />
    </div>
  );
}