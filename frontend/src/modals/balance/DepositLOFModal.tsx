import React, { useState } from 'react';
import Modal from "../../components/Modal";
import { ModalsEnum, ModalStore } from "../../stores/ModalStore";
import { useInjection } from "inversify-react";
import { toBN } from "../../utils/utils";
import { toast } from "react-toastify";
import { WalletStore } from "../../stores";
import Button from "../../components/Button";
import { MAX_UINT256 } from "../../utils/const";
import { CONTRACT_ADDRESSES } from "../../stores/WalletStore";

const DepositLOFModal = ({ modalId }: { modalId: number }) => {
    const modalStore = useInjection(ModalStore);
    const walletStore = useInjection(WalletStore);

    const [ amount, setAmount ] = useState('0');
    const [ loading, setLoading ] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const value = toBN(amount).times('1e18').integerValue()
            const deposit = walletStore.deposit;
            const paymentToken = walletStore.paymentToken;
            if (toBN(await paymentToken.methods.allowance(walletStore.address, CONTRACT_ADDRESSES.deposit).call()).lt(value)) {
                await paymentToken.methods.approve(CONTRACT_ADDRESSES.deposit, MAX_UINT256).send({ from: walletStore.address });
            }
            await deposit.methods.deposit(walletStore.profile.id, value.toFixed(0)).send({ from: walletStore.address });
            toast.success('Deposit will be processed soon');
        } finally {
            await setLoading(false);
        }
    }

    return (
        <Modal
            title='Deposit LOF'
            className='modal_settings modal_sum'
            onBack={() => {
                 modalStore.hideModal(modalId);
                 modalStore.showModal(ModalsEnum.Balance);
            }}
            modalId={modalId}
        >
            <form onSubmit={onSubmit}>
                <div className="modal__body">
                    <p>Deposit using Metamask:</p>
                    <div className="modal-sum">
                        <span className="modal-sum__text">Amount</span>
                        <div className="modal-sum__body">
                            <div className="modal-sum__num">
                                <input className="input-text" value={amount} onChange={e => setAmount(e.target.value)} type="number"/>
                                <span className="modal-sum__text">LOF</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal__footer">
                    <Button loading={loading} className="btn primary" type="submit">Deposit</Button>
                </div>
                </form>
        </Modal>
    )
}

export default DepositLOFModal
