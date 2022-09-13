import { ButtonHTMLAttributes } from "react";

export function BaseButton({
  className,
  children,
  ...other
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`font-sans font-medium transition duration-300 px-3 py-3 ease-out border-[1px] ${className}`}
      {...other}
    >
      {children}
    </button>
  );
}
