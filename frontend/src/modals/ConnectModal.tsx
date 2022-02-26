import React from 'react';
import Modal from "../components/Modal";
import { ModalsEnum } from "../stores/ModalStore";
import { observer } from "mobx-react";
import { resolve } from "inversify-react";
import { WalletStore } from "../stores";

interface IConnectModalProps {
    modalId: number;
}

interface IConnectModalState {
}

@observer
class ConnectModal extends React.Component<IConnectModalProps, IConnectModalState> {
    @resolve(WalletStore)
    declare protected readonly walletStore: WalletStore;

    render() {
        const { modalId } = this.props;

        return (
            <Modal title='Connecting wallet' modalId={modalId}>
                <div className="modal__body">
                    <div className="modal__video">
                        <div className="modal__video-item">
                            <div className="modal__video-link">
                                <a href="#"><img src={require('../images/play.png')} alt="play"/></a>
                            </div>
                            <p className="modal__video-text">Описание что нужно <br /> сделать</p>
                        </div>
                        <div className="modal__video-item">
                            <div className="modal__video-link modal__video-link_second">
                                <a href="#"><img src={require('../images/play.png')} alt="play"/></a>
                            </div>
                            <p className="modal__video-text">Описание что нужно <br /> сделать</p>
                        </div>
                        <div className="modal__video-item">
                            <div className="modal__video-link modal__video-link_third">
                                <a href="#"><img src={require('../images/play.png')} alt="play"/></a>
                            </div>
                            <p className="modal__video-text">Описание что нужно <br /> сделать</p>
                        </div>
                    </div>
                </div>
                <div className="modal__footer">
                    <button className="btn primary" type="submit" onClick={() => this.walletStore.connect()}>Connect wallet</button>
                </div>
            </Modal>
        )
    }
}

export default ConnectModal;
