import React, { useEffect, useRef } from 'react';
import { observer } from "mobx-react";
import { ModalStore } from "../stores/ModalStore";
import { useInjection } from "inversify-react";
import classNames from "classnames";

interface IModalProps {
    onShow?: () => any;
    onHide?: () => any;
    onBack?: () => any;
    title?: string | React.ReactNode | React.ReactNodeArray;
    className?: string;
    closable?: boolean;
    modalId: number;
    bare?: boolean;
    headerAddon?: React.ReactNode | React.ReactNodeArray;
}

type P = React.PropsWithChildren<IModalProps>;

const Modal: React.FC<P> = observer(({ headerAddon, bare, children, onShow, onHide, onBack, title, className, closable = true, modalId }: P) => {
    const modalStore = useInjection(ModalStore);
    const wrapRef = useRef<HTMLDivElement>();
    const modalRef = useRef<HTMLDivElement>();

    useEffect(() => {
        onShow?.();
        return () => onHide?.();
    }, []);

    const header = (
        <>
            {onBack && (
                <button className="modal__back" type="button" onClick={onBack}>
                    <img src={require('../images/back.svg')} alt="icon"/>
                </button>
            )}
            <h3 className="section-title">{title}</h3>
            {closable && (
                <button className="modal__close" type="button" onClick={() => modalStore.hideModal(modalId)}>
                    <img src={require('../images/modal-close.svg')} alt="icon"/>
                </button>
            )}
        </>
    );

    return (
        <div className="modal-wrap">
            <div className="modal-fade active" onClick={() => closable && modalStore.hideModal(modalId)} />
            <div className={classNames('modal', className)}>
                <div className="modal__wrap">
                    {!bare && (
                        <div className="modal__head">
                            {onBack ? (
                                <div className="modal__head-top">{header}</div>
                            ) : (
                                header
                            )}
                            {headerAddon}
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    )
});

export default Modal;
