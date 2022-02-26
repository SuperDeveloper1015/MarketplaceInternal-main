import React, { useState } from 'react';
import { AuctionType } from "../../utils/graphql-gqlr";
import { fd, processRequestError } from "../../utils/utils";
import { observer } from "mobx-react";
import { useInjection } from "inversify-react";
import { ModalStore, WalletStore } from "../../stores";
import Button from "../Button";
import { Api } from "../../utils/api";
import { toast } from "react-toastify";
import { ModalsEnum } from "../../stores/ModalStore";

const ArtworkAuction = observer(({ auction }: { auction: AuctionType }) => {
    const walletStore = useInjection(WalletStore);
    const modalStore = useInjection(ModalStore);
    const api = useInjection(Api);

    const [ loading, setLoading ] = useState(false);

    const onCloseAuction = async () => {
        setLoading(true);
        try {
            await api.closeAuction(parseInt(auction.id));
            walletStore.notifyUpdate();
            toast.success('Auction was successfully closed');
        } catch (e) {
            processRequestError(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="atwork__bit" key={auction.id}>
            <div className="card-sold">
                <span className="card-sold__subtitle">Edition #{auction.token.copy} {auction.lastBid ? 'Last bid' : 'Starting price'}</span>
                <div className="card-sold__inner js-card-inner">
                    <div className="card-sold__img">
                        <img src={require('../../images/lof.svg')} alt="icon"/>
                    </div>
                    <span className="card-sold__text">{fd(auction.lastBid?.amount || auction.startPrice)}</span>
                </div>
            </div>
            {walletStore.connected && (
                <div>
                    {auction.owner.id === walletStore.profile?.id && <Button className="primary" type="button" loading={loading} onClick={onCloseAuction}>Close auction</Button>}
                    {auction.lastBid?.profile.id === walletStore.profile?.id && 'Your bid is winning'}
                    {![auction.owner.id, auction.lastBid?.profile.id].includes(walletStore.profile?.id) && (
                        <button
                            className="btn primary"
                            type="button"
                            onClick={() => modalStore.showModal(ModalsEnum.Bid, { auctionId: auction.id, currentPrice: (auction.lastBid?.amount || auction.startPrice).replace(/\.?0+$/, '') })}
                        >
                            Place a bid
                        </button>
                    )}
                </div>
            )}
        </div>
    );
});

export default ArtworkAuction;
