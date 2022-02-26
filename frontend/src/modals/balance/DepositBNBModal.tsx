import React, { useEffect, useState } from 'react';
import Modal from "../../components/Modal";
import { ModalsEnum, ModalStore } from "../../stores/ModalStore";
import { useInjection } from "inversify-react";
import { useGetDepositAddress } from "../../utils/graphql-urql";
import { WalletStore } from "../../stores";
import { toBN } from "../../utils/utils";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import { Api } from "../../utils/api";

const DepositBNBModal = ({ modalId }: { modalId: number }) => {
    const modalStore = useInjection(ModalStore);
    const walletStore = useInjection(WalletStore);
    const api = useInjection(Api);

    const [ amount, setAmount ] = useState('0');
    const [ loading, setLoading ] = useState(false);
    const [ depositAddress, setDepositAddress ] = useState('');

    useEffect(() => {
        api.getDepositAddress().then(r => setDepositAddress(r))
    }, [])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await walletStore.sendFunds(depositAddress, toBN(amount));
            toast.success('Deposit will be processed soon');
        } finally {
            await setLoading(false);
        }
    }

    return (
        <Modal
            title='Deposit BNB'
            className='modal_settings modal_sum'
            onBack={() => {
                 modalStore.hideModal(modalId);
                 modalStore.showModal(ModalsEnum.Balance);
            }}
            modalId={modalId}
        >
            <form onSubmit={onSubmit}>
                <div className="modal__body">
                    <p>Send BNB to address <code>{depositAddress}</code></p>
                    <div className='hr'><span>OR</span></div>
                    <p>Deposit using Metamask:</p>
                    <div className="modal-sum">
                        <span className="modal-sum__text">Amount</span>
                        <div className="modal-sum__body">
                            <div className="modal-sum__num">
                                <input className="input-text" value={amount} onChange={e => setAmount(e.target.value)} type="number"/>
                                <span className="modal-sum__text">BNB</span>
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

export default DepositBNBModal
