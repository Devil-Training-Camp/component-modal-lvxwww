
import React from "react";
import cls from 'classnames';
import styles from './style/index.scss';
import type { BaseButtonProps } from './interface';


const Index:React.FC<BaseButtonProps> = (props) => {
    const {type='default',children,onClick} = props;
    return <button className={cls(styles.btn,styles[type])} onClick={onClick}>
        {children}
    </button>
}


export default Index;