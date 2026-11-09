import React, { forwardRef, ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-pill transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-primary text-primary-contrast hover:brightness-110 active:brightness-95",
      secondary:
        "bg-transparent text-text border-2 border-border hover:bg-surface-2 hover:border-primary active:bg-surface-2",
      ghost:
        "bg-transparent text-text hover:bg-surface-2 active:bg-surface-2",
      danger:
        "bg-danger text-white hover:brightness-110 active:brightness-95",
    };

    const sizeStyles = {
      sm: "h-10 px-4 text-sm gap-2",
      md: "h-12 px-6 text-base gap-2.5",
      lg: "h-14 px-8 text-lg gap-3",
      icon: "w-11 h-11 p-0 shrink-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
