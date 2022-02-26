import React from 'react';
import Modal from "../components/Modal";
import { ModalsEnum, ModalStore } from "../stores/ModalStore";
import Button from "../components/Button";
import { useInjection } from "inversify-react";

interface IPromptModalProps {
    data: { deferred: DeferPromise.Deferred<boolean>, text: string, description: string };
    modalId: number;
}

interface IPromptModalState {
}

const PromptModal = ({ data: { deferred, text, description }, modalId }: IPromptModalProps) => {
    const modalStore = useInjection(ModalStore);

    return (
        <Modal title={text} modalId={modalId} onHide={() => deferred.resolve(false)}>
            <div className="modal__body">
                <p>{description}</p>
            </div>
            <div className="modal__footer">
                <Button className='secondary' onClick={() => { deferred.resolve(false); modalStore.hideModal(modalId) }} style={{ marginRight: 8 }}>No</Button>
                <Button className='primary' onClick={() => { deferred.resolve(true); modalStore.hideModal(modalId) }}>Yes</Button>
            </div>
        </Modal>
    )
}

export default PromptModal;
