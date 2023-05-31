/*
 * @LastEditors: lvxianwen
 * @LastEditTime: 2023-05-31 16:15:39
 */
import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/index";
import styles from "./index.scss";
const Index = () => {
  const [showModal, setShow] = useState(false);

  return (
    <>
      <h2>modal 组件</h2>
      <div className={styles['modal-test—cont']}>
         <div
           onClick={() => {
             setShow(true);
           }}
         >
           打开弹窗
         </div>
         <div 
            onClick={()=>{
              const modal1 = Modal.info({
                title:'info弹窗啊',
                content:'方法类弹窗',
                afterClose:()=>{
                  console.log('api弹窗的afterClose')
                }
              })
            }}
          >
            method方式打开弹窗
        </div>
      </div>
      <Modal
        open={showModal}
        onCancel={() => {
          setShow(false);
        }}
        onOk={() => {
          setShow(false);
        }}
        title={<p>这是标题啊</p>}
        cancelText="cancel"
        width="600px"
        bodyStyle={{
          color: "red",
        }}
        style={{ top: 20 }}
        centered
        // mask={false}
        mask
        // maskClosable={false}
        // destroyOnClose={true}
        focusTriggerAfterClose={false}
        wrapClassName="xianwen"
        zIndex={900}
        afterOpenChange={open => {
          console.log('afterOpenChange',open)
        }}
        afterClose={() => {
          console.log('afterClose')
        }}
      >
        外部弹窗内容
      </Modal>

      
    </>
  );
};

export default Index;
