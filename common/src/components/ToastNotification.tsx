import { CircleCheck, CircleX } from "lucide-react";


export type ToastType = "success" | "error";
interface Props {
  toastType: ToastType;
  message: string;
}

const ToastNotification = ({ toastType, message }: Props) => {
  return (
    <div
      className={`flex items-center fixed bottom-0 w-full mt-4 p-2  rounded gap-2 ease-in-out duration-300 ${
        toastType === "success"
          ? "bg-green-100 text-green-800 border border-green-300"
          : "bg-red-100 text-red-800 border border-red-300"
      }`}
    >
      {toastType === "success" ? (
        <CircleCheck className="h-6 w-6 text-green-800" />
      ) : (
        <CircleX className="h-6 w-6 text-red-800" />
      )}

      <p>{message}</p>
    </div>
  );
};

export default ToastNotification;
