import clsx from "clsx";

type Props = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function Card({ title, subtitle, children, className = "" }: Props) {
  return (
    <div
      className={clsx(
        "card w-80 p-4",
        className
      )}
    >
      {title && <h2 className="card-title text-lg font-semibold">{title}</h2>}
      {subtitle && <p className="card-subtitle text-sm">{subtitle}</p>}
      <div className="card-text mt-2">{children}</div>
    </div>
  );
}