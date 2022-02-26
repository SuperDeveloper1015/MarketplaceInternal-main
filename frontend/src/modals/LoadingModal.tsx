import React from 'react';
import Modal from "../components/Modal";
import { ModalsEnum } from "../stores/ModalStore";

interface ILoadingModalProps {
    data: { title: string, subtitle?: string };
    modalId: number;
}

interface ILoadingModalState {
}

class LoadingModal extends React.Component<ILoadingModalProps, ILoadingModalState> {
    render() {
        const { data: { title, subtitle }, modalId } = this.props;
        return (
            <Modal title={title} modalId={modalId}>
                <div className="modal__body">
                    <div className="loader-wrap">
                        <div className="loader-img">
                            <img src={require('../images/loader-img.png')} alt=""/>
                        </div>
                        <svg className="loader">
                            <circle cx="30" cy="30" r="28"/>
                        </svg>
                    </div>
                    <span className="loader-text">{subtitle}</span>
                </div>
            </Modal>
        )
    }
}

export default LoadingModal;
