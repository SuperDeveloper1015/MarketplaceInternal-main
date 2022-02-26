import React, { useState } from 'react';
import Modal from "../components/Modal";
import { ModalsEnum, ModalStore } from "../stores/ModalStore";
import { useInjection } from "inversify-react";
import { Api } from "../utils/api";
import { processRequestError, toBN } from "../utils/utils";
import { toast } from "react-toastify";
import Button from "../components/Button";
import { WalletStore } from "../stores";

const BidModal = ({ modalId, data: { auctionId, currentPrice } }: { modalId: number, data: { auctionId: string, currentPrice: string } }) => {
    const modalStore = useInjection(ModalStore);
    const walletStore = useInjection(WalletStore);
    const api = useInjection(Api);

    const [ amount, setAmount ] = useState(currentPrice);
    const [ loading, setLoading ] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.placeBid(parseInt(auctionId), toBN(amount));
            toast.success('Bid was placed');
            walletStore.notifyUpdate();
            modalStore.hideModal(modalId);
        } catch (e) {
            processRequestError(e);
        } finally {
            await setLoading(false);
        }
    }

    return (
        <Modal
            title='Place a bid'
            className='modal_settings modal_sum'
            modalId={modalId}
        >
            <form onSubmit={onSubmit}>
                <div className="modal__body">
                    <div className="modal-sum">
                        <span className="modal-sum__text">Amount</span>
                        <div className="modal-sum__body">
                            <div className="modal-sum__num">
                                <input className="input-text" min={currentPrice} value={amount} onChange={e => setAmount(e.target.value)} type="number"/>
                                <span className="modal-sum__text">LOF</span>
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

export default BidModal
