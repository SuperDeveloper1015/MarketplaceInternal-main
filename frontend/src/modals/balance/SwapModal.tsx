import React, { useState } from 'react';
import Modal from "../../components/Modal";
import { ModalsEnum, ModalStore } from "../../stores/ModalStore";
import { useInjection } from "inversify-react";
import { fd, processRequestError, toBN } from "../../utils/utils";
import { WalletStore } from "../../stores";
import { toast } from "react-toastify";
import { Api } from "../../utils/api";
import Button from "../../components/Button";

const WithdrawBNBModal = ({ modalId }: { modalId: number }) => {
    const modalStore = useInjection(ModalStore);
    const walletStore = useInjection(WalletStore);
    const api = useInjection(Api);

    const [ amount, setAmount ] = useState('0');
    const [ loading, setLoading ] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.swap(toBN(amount));
            toast.success('Swapped successfully');
        } catch (e) {
            processRequestError(e);
        } finally {
            await setLoading(false);
        }
    }

    return (
        <Modal
            title='Swap to LOF'
            className='modal_settings modal_sum'
            onBack={() => {
                 modalStore.hideModal(modalId);
                 modalStore.showModal(ModalsEnum.Balance);
            }}
            modalId={modalId}
        >
            <form onSubmit={onSubmit}>
                <div className="modal__body">
                    <div className="modal-sum">
                        <span className="modal-sum__text">You will get</span>
                        <div className="modal-sum__body">
                            <div className="modal-sum__num">
                                <input className="input-text" value={amount} onChange={e => setAmount(e.target.value)} type="number"/>
                                <span>
                                    <span className="modal-sum__text">LOF</span>
                                    <button type='button' onClick={() => setAmount(toBN(walletStore.profile.balanceBnb).div(walletStore.info.lofPrice).toString())}>MAX</button>
                                </span>
                            </div>
                            <div className="modal-sum__result">
                                <img src={require('../../images/bnb.png')} alt="icon"/>
                                <span className="modal-sum__text">{fd(toBN(amount).times(walletStore.info?.lofPrice))}</span>
                                {/*<span className="modal-sum__text_small">($1,335.10)</span>*/}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal__footer">
                    <Button className="btn primary" loading={loading} type="submit">Confirm</Button>
                </div>
            </form>
        </Modal>
    )
}

export default WithdrawBNBModal
