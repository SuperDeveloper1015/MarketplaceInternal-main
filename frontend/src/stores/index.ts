import { History } from "history";

export { RouterStore } from "mobx-react-router";
export { RootStore } from "./RootStore";
export { ModalStore } from "./ModalStore";
export { WalletStore } from "./WalletStore";

// @ts-ignore
export class HistoryStore implements History {}
