/*
 * @LastEditors: lvxianwen
 * @LastEditTime: 2023-05-31 17:30:05
 */
import React from "react";
import { render as reactRender,unmountComponentAtNode as reactUnmount } from "react-dom";
import Modal from "./Modal";
import type { ModalFuncProps } from "./interface";
import { handleContainer } from '../../utils/modal';
import destroyFns from './destroyFns';

export function confirm(modalConfig:ModalFuncProps){

    const currentConfig = {...modalConfig,open:true} as any;
    const { getContainer,type,afterClose } = modalConfig;
    let container:any = document.createDocumentFragment();
    if(getContainer){
        container = handleContainer(getContainer,type);
    }


    function render(renderConfig:any){
        const {content,onOk,onCancel} = renderConfig;
        const new_onOk = () => {
            if(onOk){
                return onOk?.(close)
            }
            close();
        }

        const new_onCancel = () => {
            if(onCancel){
                return onCancel?.(close)
            }
            close();
        }

        reactRender(
            <Modal
             {...renderConfig}
             onOk={new_onOk}
             onCancel={new_onCancel}
             destroyOnClose
            >
              {content}
            </Modal>,container
        )
    }

    function close(){
        afterClose && afterClose();
        reactUnmount(container)
    }

    function update(newConfig:ModalFuncProps){
        render(newConfig)
    }

    render(currentConfig)

    //将close 回调
    destroyFns.push(close)
    return {
        destroy:close,
        update
    }
}