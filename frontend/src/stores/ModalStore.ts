import { injectable } from "inversify";
import { RootStore } from "./RootStore";
import { action, computed, makeObservable, observable } from "mobx";
import { generateSignature } from "../utils/utils";
import { ProfileType } from "../utils/graphql-gqlr";
import defer from "defer-promise";

export enum ModalsEnum {
    _,
    Connect,
    EditProfile,
    Loading,
    Balance,
    WithdrawLOF,
    WithdrawBNB,
    DepositLOF,
    DepositBNB,
    SwapToLOF,
    Verification,
    UploadArtwork,
    CreateAuction,
    Bid,
    Prompt,
    Share,
}

export interface ModalEntry {
    key: ModalsEnum;
    data?: any;
}

@injectable()
export class ModalStore {
    @observable activeModals: ModalEntry[] = [];

    constructor(private readonly rootStore: RootStore) {
        makeObservable(this);
    }

    @action showModal = (key: ModalsEnum, data?: any) => {
        this.activeModals.push({ key, data });
        return this.activeModals.length - 1;
    }

    @action hideModal = (id: number) => {
        this.activeModals = this.activeModals.filter((_, i) => i !== id);
    }

    @action hideAllModals = () => {
        this.activeModals = [];
    }

    openProfileEdit = async (refetchProfile?: any) => {
        this.showModal(ModalsEnum.EditProfile, { ...this.rootStore.walletStore.profile, refetchProfile });
    }

    @action prompt(text: string, description) {
        const deferred = defer<boolean>();
        this.showModal(ModalsEnum.Prompt, { deferred, text, description });
        return deferred.promise;
    }
}
