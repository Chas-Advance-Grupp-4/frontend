import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: Props) {
  return (
    <div
      className={clsx(
        "rounded-lg bg-bg-card text-gray-900 shadow-sm p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
