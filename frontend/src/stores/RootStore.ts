import * as stores from './';
import { createBrowserHistory, History } from "history";
import { syncHistoryWithStore } from "mobx-react-router";
import { wrapHistory } from "oaf-react-router";
import { Container } from 'inversify';
import { Client, createClient } from "urql";
import { GRAPHQL_ENDPOINT } from "../utils/const";
import { Api } from "../utils/api";
import store from 'store';

export class RootStore {
    public urqlClient: Client;

    public historyStore: History;
    public routerStore: stores.RouterStore;
    public modalStore: stores.ModalStore;
    public walletStore: stores.WalletStore;

    public container: Container;

    public constructor() {
        this.urqlClient = createClient({
            url: GRAPHQL_ENDPOINT,
        });

        const browserHistory = createBrowserHistory();
        wrapHistory(browserHistory, {
            smoothScroll: true,
            primaryFocusTarget: 'body',
        });

        this.routerStore = new stores.RouterStore();
        this.historyStore = syncHistoryWithStore(browserHistory, this.routerStore);
        this.modalStore = new stores.ModalStore(this);
        this.walletStore = new stores.WalletStore(this);

        this.container = new Container();
        this.container.bind(stores.RouterStore).toConstantValue(this.routerStore);
        this.container.bind(stores.HistoryStore).toConstantValue(this.historyStore);
        this.container.bind(stores.ModalStore).toConstantValue(this.modalStore);
        this.container.bind(stores.WalletStore).toConstantValue(this.walletStore);
        this.container.bind(Api).toDynamicValue(() => this.api);
    }

    get token() {
        return store.get('token');
    }

    get api() {
        if (this.walletStore.connected && this.walletStore.address !== store.get('tokenAddress')) {
            this.walletStore.resetWallet();
            store.remove('tokenAddress')
            store.remove('token')
            store.remove('connected')
        }
        return new Api(GRAPHQL_ENDPOINT, store.get('token'));
    }
}
