/*
 * @LastEditors: lvxianwen
 * @LastEditTime: 2023-05-30 10:19:04
 */
import OriginModal from './Modal';
import type { ModalFuncProps } from "./interface";
import destroyFns from './destroyFns';
import { confirm } from './confirm';

const Modal = OriginModal as any;

Modal.confirm = function infoFn(props: ModalFuncProps) {
    return confirm({
        ...props,
        type:'confirm'
    });
};

Modal.info = function infoFn(props: ModalFuncProps) {
    return confirm({
        ...props,
        type:'info'
    });
};

Modal.success = function infoFn(props: ModalFuncProps) {
    return confirm({
        ...props,
        type:'success'
    });
};

Modal.warning = function infoFn(props: ModalFuncProps) {
    return confirm({
        ...props,
        type:'warning'
    });
};

Modal.error = function infoFn(props: ModalFuncProps) {
    return confirm({
        ...props,
        type:'error'
    });
};

//销毁所有弹窗，就把存放close数组执行并清空
Modal.destroyAll = function(){
    while(destroyFns.length){
        const closeFn = destroyFns.pop();
        closeFn && closeFn();
    }
}



export default Modal;