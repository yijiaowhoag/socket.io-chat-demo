import React from 'react';
import { IconType } from 'react-icons';

const ButtonVariant = ['primary', 'outline', 'ghost', 'light', 'dark'] as const;

const ButtonSize = ['sm', 'base'] as const;

type ButtonProps = {
  isLoading?: boolean;
  variant?: (typeof ButtonVariant)[number];
  size?: (typeof ButtonSize)[number];
  icon?: IconType;
} & React.ComponentProps<'button'>;

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  variant = 'primary',
  size = 'base',
  icon: Icon,
  ...props
}) => {
  const base =
    'inline-flex items-center rounded font-medium focus-visible:ring-primary-500 focus:outline-none focus-visible:ring shadow-sm transition-colors duration-75';
  const variants = {
    primary:
      'bg-primary-500 text-white border-primary-600 border hover:bg-primary-600 hover:text-white active:bg-primary-700 disabled:bg-primary-700',
    outline:
      'text-primary-500 border-primary-500 border hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100 hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
    ghost:
      'text-primary-500 shadow-none hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100 hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
    light:
      'bg-white text-gray-700 border border-gray-300 hover:text-dark hover:bg-gray-100 active:bg-white/80 disabled:bg-gray-200',
    dark: 'bg-gray-900 text-white border border-gray-600 hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-700',
  };
  const sizes = {
    base: 'px-3 py-1.5 text-sm md:text-base',
    sm: 'px-2 py-1 text-xs md:text-sm',
  };

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {Icon && <Icon size="1em" />}
      {children}
    </button>
  );
};

export default Button;
