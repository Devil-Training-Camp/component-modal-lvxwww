/*
 * @LastEditors: lvxianwen
 * @LastEditTime: 2023-05-31 17:31:19
 */
/*
 * @LastEditors: lvxianwen
 * @LastEditTime: 2023-05-24 15:56:15
 */
import React, { useEffect, useRef, useState } from "react";
import Portal from "@rc-component/portal";
import cls from "classnames";

import styles from "./style/index.scss";
import type { ModalProps } from "./interface";
import Button from "../Button";
import { handleContainer } from '../../utils/modal';

const Index: React.FC<ModalProps> = (props) => {
  const [visible, setVisible] = useState(false || props?.forceRender);
  const [clickPosition,setPosition] = useState(null);
  const modal_wrap_ref = useRef(null);
  const active_element_ref = useRef(null);
  const modal_cont_ref = useRef(null);
  const {
    open,
    onCancel,
    title,
    footer,
    maskClosable = true,
    width = 520,
    bodyStyle = {},
    style = {},
    centered = false,
    closable = true,
    modalRender,
    destroyOnClose=false,
    focusTriggerAfterClose=true,
    wrapClassName='',
    zIndex=1000,
    afterClose,
    afterOpenChange,
    type = ''
  } = props;

  //鼠标监听
  useEffect(()=>{ 
    //鼠标位置监控，用于动画
    document.addEventListener('click',getPosition,true)
    return () => {
      document.removeEventListener('click',getPosition,true)
    }
  },[])

  //聚焦触发元素
  useEffect(()=>{
    if((!visible || !open) && focusTriggerAfterClose){
      active_element_ref.current && active_element_ref.current.focus();
    }
  },[open,visible,focusTriggerAfterClose])

  //销毁组件
  useEffect(() => {
    if (open) {
      setVisible(true);
      active_element_ref.current = document.activeElement
    }

    //销毁组件
    if(!open && destroyOnClose && visible){
      handleDestroy();
    }

  }, [open,destroyOnClose]);

  //弹窗完全关闭
  useEffect(()=>{
    if(!open && visible){
      afterClose && afterClose();
      afterOpenChange && afterOpenChange(false);
    }
    if(open && visible){
      afterOpenChange && afterOpenChange(true);
    }
  },[visible,open])


  useEffect(() => {
    if (!maskClosable) return;
    const wrapEle = modal_wrap_ref.current
    if (!wrapEle) return;
    const handleDropClose = (e: any) => {
      const target = e.target;
      if (wrapEle !== target) {
        return;
      }
      handleAnimationClose(onCancel.bind(null,e));
    };

    open && document.addEventListener("click", handleDropClose);

    return () => {
      document.removeEventListener("click", handleDropClose);
    };
  }, [open,maskClosable]);


  const handleCancel = (e?: any) => {
    const { onCancel } = props;
    handleAnimationClose(onCancel.bind(null,e));
  };

  const handleOk = (e?: React.MouseEvent<HTMLButtonElement>) => {
    const { onOk } = props;
    onOk?.(e);
  };

  //mask
  const renderMask = (): React.ReactNode => {
    const { mask = true, maskStyle } = props;
    if(!mask) return null
    return (
      <div
        className={styles.modalMask}
        style={{ display: visible && open ? null : "none",zIndex,...maskStyle }}
      />
    );
  };

  //footer按钮
  const renderFooter = () => {
    const {
      cancelButtonProps = {},
      okButtonProps = {},
      cancelText = "取消",
      okText = "确定",
      okType = "primary",
      type
    } = props;
    return (
      <>
       {
         !type || type === 'info' ? <Button onClick={handleCancel} {...cancelButtonProps}>{cancelText}</Button> : null
       }
        <Button onClick={handleOk} type={okType} {...okButtonProps}>
          {okText}
        </Button>
      </>
    );
  };

  //modal_cont  普通modal
  const renderModalCont = () => {
    return (
      <div className={styles.modalCont}>
        {closable ? renderCloseBtn() : null}
        {title ? <div className={styles.modalHeader}>{title}</div> : null}
        <div className={styles.modalBody} style={{ ...bodyStyle }}>
          {props.children}
        </div>
        {footer === null ? null : (
          <div className={styles.modalFooter}>
            {footer ? footer : renderFooter()}
          </div>
        )}
      </div>
    );
  };

  //静态方法modal
  const renderFuncModalCont = () => {
    return (
      <div className={styles.modalCont}>
          <div className={styles.modalBody} style={{ ...bodyStyle }}>
             <div className={styles.modalIcon}>

             </div>
             <div className={styles.modalTitle}>
                  {title}
             </div>
             <div className={styles.modalInfo}>
                {props.children}
             </div>
         </div>
         {footer === null ? null : (
          <div className={styles.modalFooter}>
            {footer ? footer : renderFooter()}
          </div>
          )}
      </div>
    )
  }

  //关闭按钮
  const renderCloseBtn = () => {
    const { closeIcon } = props;
    return (
      <button className={styles.modalClose} onClick={handleCancel}>
        {closeIcon ? closeIcon : <span>x</span>}
      </button>
    );
  };

  //获取container
  const getContainerByProps = () => {
    const {getContainer=false} = props;
    if(getContainer === false) return document.body;
    return handleContainer(getContainer)
  }

  //销毁
  const handleDestroy = () => {
    setVisible(false)
  }

  //根据鼠标计算弹出位置 用于动画
  const getPosition = (e:MouseEvent) => {
    if(modal_wrap_ref.current) return;
    const { innerWidth, innerHeight } = window;
    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;
    const pageY = e.clientY - centerY;
    const pageX = e.clientX - centerX;
    const new_position = {
      x:`${(pageX / innerWidth) * 100}vw`,
      y:`${(pageY / innerHeight) * 100}vh`
    }
    setPosition({...new_position})
  }

  //动画关闭弹窗
  const handleAnimationClose = (fn:Function | any) => {
    if(!modal_wrap_ref.current){
      fn && fn();
      return;
    }
    modal_wrap_ref.current.classList.add(styles['hide'])
    setTimeout(()=>{
      fn && fn();
      modal_wrap_ref.current && modal_wrap_ref.current.classList.remove(styles['hide']);
    },300)
  }

  return (
    <Portal open={open || visible} getContainer={getContainerByProps()}>
      <div className={cls(styles.modalRoot,"J-modal-root")}
       style={{['--x' as any]:clickPosition?clickPosition?.x:0,['--y' as any]:clickPosition?clickPosition?.y:0 }}
      > 
        <>{renderMask()}</>
        <div
          className={cls(styles.modalWrap, centered ? styles.modalCenter : "",wrapClassName,"J-modal-wrap",clickPosition?.x?"":styles.modalNoAnimation)}
          style={{ display: visible && open ? null : "none",zIndex}}
          ref={modal_wrap_ref}
        >
          <div
            className={styles.modal}
            style={{ width, ...style }}
            ref={modal_cont_ref}
          >
            {type ? renderFuncModalCont() : modalRender ? modalRender(renderModalCont()) : renderModalCont()}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Index;
