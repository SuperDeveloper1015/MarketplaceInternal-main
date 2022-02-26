import React, { useState } from 'react';
import Modal from "../../components/Modal";
import { ModalsEnum, ModalStore } from "../../stores/ModalStore";
import { observer } from "mobx-react";
import classNames from "classnames";
import ClickAwayListener from "react-click-away-listener";
import { useInjection } from "inversify-react";
import { WalletStore } from "../../stores";
import { fd, toBN } from "../../utils/utils";

interface IBalanceModalProps {
    modalId: number;
}

const BalanceModal = observer(({ modalId }: IBalanceModalProps) => {
    const modalStore = useInjection(ModalStore);
    const walletStore = useInjection(WalletStore);

    const [ cardList1, setCardList1 ] = useState(false);
    const [ cardList2, setCardList2 ] = useState(false);

    return (
        <Modal title='Balance settings' className='modal_settings' modalId={modalId}>
            <div className="modal__body">
                <div className="modal__items">
                    <div className="modal__item">
                        <div className="card-sold card-sold_big js-card-inner">
                            <div className="card-sold__img">
                                <img src={require('../../images/lof.svg')} alt="icon"/>
                            </div>
                            <span className="card-sold__text">{fd(toBN(walletStore.profile?.balanceLof))}</span>
                            {/*<button className="card-sold__btn" type="button" onClick={() => setCardList1(!cardList1)}>?</button>*/}
                            <ClickAwayListener onClickAway={() => cardList1 && setCardList1(false)}>
                                <ul className={classNames('card-sold__list', { active: cardList1 })}>
                                    <li className="card-sold__item">
                                        <div className="card-sold__icon">
                                            <img src={require('../../images/bnb.png')} alt="icon"/>
                                        </div>
                                        <span>150.50</span>
                                    </li>
                                    <li className="card-sold__item">
                                        <div className="card-sold__icon">
                                            <img src={require('../../images/usd.png')} alt="icon"/>
                                        </div>
                                        <span>12102.07</span>
                                    </li>
                                </ul>
                            </ClickAwayListener>
                        </div>
                        <div className="modal__links">
                            <a className="modal__link" onClick={() => { modalStore.showModal(ModalsEnum.DepositLOF); modalStore.hideModal(modalId) }}>Deposit</a>
                            <a className="modal__link" onClick={() => { modalStore.showModal(ModalsEnum.WithdrawLOF); modalStore.hideModal(modalId) }}>Withdraw</a>
                        </div>
                    </div>
                    <div className="modal__item">
                        <div className="card-sold card-sold_big js-card-inner">
                            <div className="card-sold__img">
                                <img src={require('../../images/bnb.png')} alt="icon"/>
                            </div>
                            <span className="card-sold__text">{fd(toBN(walletStore.profile?.balanceBnb))}</span>
                            {/*<button className="card-sold__btn" type="button" onClick={() => setCardList2(!cardList2)}>?</button>*/}
                            <ClickAwayListener onClickAway={() => cardList2 && setCardList2(false)}>
                                <ul className={classNames('card-sold__list', { active: cardList2 })}>
                                    <li className="card-sold__item">
                                        <div className="card-sold__icon">
                                            <img src={require('../../images/bnb.png')} alt="icon"/>
                                        </div>
                                        <span>150.50</span>
                                    </li>
                                    <li className="card-sold__item">
                                        <div className="card-sold__icon">
                                            <img src={require('../../images/usd.png')} alt="icon"/>
                                        </div>
                                        <span>12102.07</span>
                                    </li>
                                </ul>
                            </ClickAwayListener>
                        </div>
                        <div className="modal__links">
                            <a className="modal__link" onClick={() => { modalStore.showModal(ModalsEnum.SwapToLOF); modalStore.hideModal(modalId) }}>Swap to LOF</a>
                            <a className="modal__link" onClick={() => { modalStore.showModal(ModalsEnum.DepositBNB); modalStore.hideModal(modalId) }}>Deposit</a>
                            <a className="modal__link" onClick={() => { modalStore.showModal(ModalsEnum.WithdrawBNB); modalStore.hideModal(modalId) }}>Withdraw</a>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
});

export default BalanceModal;
