import React, { useState } from 'react';
import Modal from "../../components/Modal";
import { ModalsEnum, ModalStore } from "../../stores/ModalStore";
import { useInjection } from "inversify-react";
import { Api } from "../../utils/api";
import { processRequestError, toBN } from "../../utils/utils";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import { WalletStore } from "../../stores";

const WithdrawLOFModal = ({ modalId }: { modalId: number }) => {
    const modalStore = useInjection(ModalStore);
    const walletStore = useInjection(WalletStore);
    const api = useInjection(Api);

    const [ amount, setAmount ] = useState('0');
    const [ address, setAddress ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.requestWithdraw(toBN(amount), address, 'lof');
            toast.success('Withdraw request will be processed soon');
            modalStore.hideModal(modalId);
            modalStore.showModal(ModalsEnum.Balance);
        } catch (e) {
            processRequestError(e);
        } finally {
            await setLoading(false);
        }
    }

    return (
        <Modal
            title='Withdraw LOF'
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
                        <span className="modal-sum__text">Amount</span>
                        <div className="modal-sum__body">
                            <div className="modal-sum__num">
                                <input className="input-text" value={amount} onChange={e => setAmount(e.target.value)} type="number"/>
                                <span>
                                    <span className="modal-sum__text">LOF</span>
                                    <button type='button' onClick={() => setAmount(walletStore.profile.balanceLof.replace(/\.?0+$/, ''))}>MAX</button>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-sum">
                        <span className="modal-sum__text">Address</span>
                        <div className="modal-sum__body">
                            <div className="modal-sum__num">
                                <input className="input-text" value={address} onChange={e => setAddress(e.target.value)} type="text"/>
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

export default WithdrawLOFModal
