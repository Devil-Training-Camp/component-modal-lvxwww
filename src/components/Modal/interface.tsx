/*
 * @LastEditors: lvxianwen
 * @LastEditTime: 2023-05-31 16:12:22
 */
import type { BaseButtonProps, ButtonType } from "../Button/interface";
type MousePosition = { x: number; y: number } | null;

type getContainerFunc = () => HTMLElement;

export interface ModalProps {
  open?: boolean;
  onOk?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  afterClose?: () => void;
  afterOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  cancelButtonProps?: BaseButtonProps;
  cancelText?: React.ReactNode;
  okButtonProps?: BaseButtonProps;
  okText?: React.ReactNode;
  okType?: ButtonType;
  mask?: boolean;
  maskStyle?: React.CSSProperties;
  maskClosable?: boolean;
  width?: string | number;
  bodyStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  centered?: boolean;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  modalRender?: (node: React.ReactNode) => React.ReactNode;
  getContainer?: string | HTMLElement | getContainerFunc | false;
  destroyOnClose?: boolean;
  forceRender?: boolean;
  focusTriggerAfterClose?: boolean;
  wrapClassName?: string;
  zIndex?: number;
  type?:string;
}

export interface ModalFuncProps {
  onOk?: (...args: any[]) => any;
  onCancel?: (...args: any[]) => any;
  afterClose?: () => void;
  autoFocusButton?: null | 'ok' | 'cancel';
  title?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  cancelButtonProps?: BaseButtonProps;
  cancelText?: React.ReactNode;
  okButtonProps?: BaseButtonProps;
  okText?: React.ReactNode;
  okType?: ButtonType;
  mask?: boolean;
  maskStyle?: React.CSSProperties;
  maskClosable?: boolean;
  width?: string | number;
  bodyStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  centered?: boolean;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  getContainer?: string | HTMLElement | getContainerFunc | false;
  focusTriggerAfterClose?: boolean;
  wrapClassName?: string;
  zIndex?: number;
  type?: 'info' | 'success' | 'error' | 'warn' | 'warning' | 'confirm';
}
