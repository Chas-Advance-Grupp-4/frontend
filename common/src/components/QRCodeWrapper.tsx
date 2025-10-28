import { ReactNode, FC } from "react";

export interface QRCodeProps {
  value: string;
}

export interface QRScannerProps {
  onScan: (value: string) => void;
}

export const QRContainer: FC<{ title?: string; children: ReactNode }> = ({ title, children }) => (
  <div className="flex flex-col items-center justify-center p-4">
    {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
    {children}
  </div>
);
