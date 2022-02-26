import React from 'react';
import ConnectModal from "./ConnectModal";
import { ModalsEnum, ModalStore } from "../stores/ModalStore";
import { observer } from "mobx-react";
import { resolve, useInjection } from "inversify-react";
import { ScrollLock } from "../components/utils/ScrollLock";
import EditProfileModal from "./EditProfileModal";
import LoadingModal from "./LoadingModal";
import BalanceModal from "./balance/BalanceModal";
import WithdrawLOFModal from "./balance/WithdrawLOFModal";
import WithdrawBNBModal from "./balance/WithdrawBNBModal";
import DepositLOFModal from "./balance/DepositLOFModal";
import DepositBNBModal from "./balance/DepositBNBModal";
import SwapModal from "./balance/SwapModal";
import VerificationModal from "./VerificationModal";
import UploadArtworkModal from "./UploadArtworkModal";
import CreateAuctionModal from "./CreateAuctionModal";
import BidModal from "./BidModal";
import PromptModal from "./PromptModal";
import ShareModal from "./ShareModal";

const MODAL_REGISTRY = {
    [ModalsEnum.Connect]: ConnectModal,
    [ModalsEnum.EditProfile]: EditProfileModal,
    [ModalsEnum.Loading]: LoadingModal,
    [ModalsEnum.Balance]: BalanceModal,
    [ModalsEnum.WithdrawLOF]: WithdrawLOFModal,
    [ModalsEnum.WithdrawBNB]: WithdrawBNBModal,
    [ModalsEnum.DepositLOF]: DepositLOFModal,
    [ModalsEnum.DepositBNB]: DepositBNBModal,
    [ModalsEnum.SwapToLOF]: SwapModal,
    [ModalsEnum.Verification]: VerificationModal,
    [ModalsEnum.UploadArtwork]: UploadArtworkModal,
    [ModalsEnum.CreateAuction]: CreateAuctionModal,
    [ModalsEnum.Bid]: BidModal,
    [ModalsEnum.Prompt]: PromptModal,
    [ModalsEnum.Share]: ShareModal,
}

export const ModalsContainer = observer(() => {
    const modalStore = useInjection(ModalStore);

    return (
        <>
            {modalStore.activeModals.length > 0 && <ScrollLock />}
            {modalStore.activeModals.map((m, i) => {
                const Component = MODAL_REGISTRY[m.key];
                return <Component key={i} data={m.data} modalId={i} />;
            })}
        </>
    )
});
