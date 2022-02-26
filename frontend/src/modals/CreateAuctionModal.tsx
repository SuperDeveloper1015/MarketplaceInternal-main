import React, { useState } from 'react';
import { observer } from "mobx-react";
import Modal from "../components/Modal";
import { useInjection } from "inversify-react";
import { ModalStore, WalletStore } from "../stores";
import { Api } from "../utils/api";
import Button from "../components/Button";
import { fd, processRequestError, toBN } from "../utils/utils";
import { CONTRACT_ADDRESSES } from "../stores/WalletStore";
import { toast } from "react-toastify";

const CreateAuctionModal = observer(({ modalId, data: tokenId }: { modalId: number, data: number }) => {
    const walletStore = useInjection(WalletStore);
    const modalStore = useInjection(ModalStore);
    const api = useInjection(Api);

    const [startingPrice, setStartingPrice] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.createAuction(tokenId, startingPrice);
            await walletStore.nft.methods.safeTransferFrom(walletStore.address, CONTRACT_ADDRESSES.storage, tokenId.toString()).send({ from: walletStore.address });
            modalStore.hideModal(modalId);
            toast.success('Auction was started');
        } catch (e) {
            processRequestError(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal title='Create Auction' modalId={modalId} closable={!loading} className='modal_sum'>
            <form onSubmit={onSubmit}>
                <div className="modal__body">
                    <div className="modal-sum">
                        <span className="modal-sum__text">Starting price</span>
                        <div className="modal-sum__body">
                            <div className="modal-sum__num">
                                <input className="input-text" type="number" value={startingPrice} onChange={e => setStartingPrice(e.target.value)} />
                                <span className="modal-sum__text">LOF</span>
                            </div>
                            <div className="modal-sum__result">
                                <div className="card-sold__icon">
                                    <img src={require('../images/bnb.png')} alt="icon" />
                                </div>
                                {/* <span className="modal-sum__text">{fd(toBN(startingPrice).times(walletStore.info?.lofPrice))}</span> */}
                                <span className="modal-sum__text">{fd(toBN(startingPrice).times(0.001))}</span>
                                {/*<span className="modal-sum__text_small">($1,335.10)</span>*/}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal__footer">
                    <Button loading={loading} className='primary' type='submit'>List</Button>
                </div>
            </form>
        </Modal>
    )
});

export default CreateAuctionModal;
