/*
 * @LastEditors: lvxianwen
 * @LastEditTime: 2023-05-24 16:49:49
 */
const ButtonTypes = ['default', 'primary', 'ghost', 'dashed', 'link', 'text'] as const;
export type ButtonType = typeof ButtonTypes[number];


const ButtonShapes = ['default', 'circle', 'round'] as const;
export type ButtonShape = typeof ButtonShapes[number];

export type SizeType = 'small' | 'middle' | 'large' | undefined;

export type LegacyButtonType = ButtonType | 'danger';

export interface BaseButtonProps {
    type?: ButtonType;
    icon?: React.ReactNode;
    shape?: ButtonShape;
    size?: SizeType;
    disabled?: boolean;
    loading?: boolean | { delay?: number };
    prefixCls?: string;
    className?: string;
    rootClassName?: string;
    ghost?: boolean;
    danger?: boolean;
    block?: boolean;
    children?: React.ReactNode;
    [key: `data-${string}`]: string;
    classNames?: { icon: string };
    styles?: { icon: React.CSSProperties };
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  }