import { injectable } from "inversify";
import { RootStore } from "./RootStore";
import { action, makeObservable, observable, runInAction } from "mobx";
import Web3 from "web3";
import { toast } from "react-toastify";
import { InfoType, Profile } from "../utils/graphql-gqlr";
import store from "store";
import { generateSignature } from "../utils/utils";
import DEPOSIT_ABI from '../../../contracts/interfaces/deposit.abi.json';
import PAYMENT_TOKEN_ABI from '../../../contracts/interfaces/paymentToken.abi.json';
import NFT_ABI from '../../../contracts/interfaces/nft.abi.json';
import STORAGE_ABI from '../../../contracts/interfaces/storage.abi.json';
import { ContractContext as DepositContext } from '../utils/contracts/deposit';
import { ContractContext as PaymentTokenContext } from '../utils/contracts/paymentToken';
import { ContractContext as NFTContext } from '../utils/contracts/nft';
import { ContractContext as StorageContext } from '../utils/contracts/storage';
import CONTRACT_ADDRESSES from '../../../contracts/addresses.json';
import BN from 'bignumber.js';
import Timeout from 'await-timeout';

export const CHAIN_ID = 97;
const DEFAULT_RPC = 'https://data-seed-prebsc-1-s3.binance.org:8545/';

const chainParameters = {
    chainId: '0x61',
    chainName: 'BSC Test',
    nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
    },
    rpcUrls: [DEFAULT_RPC],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
}

@injectable()
export class WalletStore {
    private rawProvider: any = new Web3.providers.HttpProvider(DEFAULT_RPC);

    @observable initialized: boolean = false;
    @observable connected: boolean = false;
    @observable address?: string;
    @observable profile?: Profile;
    @observable lastBlock?: number;
    @observable info?: InfoType;
    @observable updateNotification?: number;

    constructor(private readonly rootStore: RootStore) {
        makeObservable(this);
        this.initialize();
        this.web3.eth.subscribe('newBlockHeaders', this.updateCurrentBlock);
    }

    @action private updateCurrentBlock = (_, block) => {
        this.lastBlock = block?.number;
        this.loadProfile();
    }

    private initialize = async () => {
        await Timeout.set(10);
        if (store.get('connected')) {
            await this.connect();
        }
        runInAction(() => this.initialized = true);
        const info = await this.rootStore.api.getInfo();
        runInAction(() => this.info = info);
    }

    loadProfile = async () => {
        if (!this.address)
            return;
        const profile = await this.rootStore.api.getProfile(this.address);
        runInAction(() => this.profile = profile);
    }

    resetWallet = async (chainId?: string) => {
        if (parseInt(chainId, 16) == CHAIN_ID)
            return;
        runInAction(() => { this.connected = false; this.address = undefined });
        this.rawProvider?.off?.('accountsChanged', this.resetWallet)
        this.rawProvider?.off?.('chainChanged', this.resetWallet);
        this.rawProvider?.off?.('disconnected', this.resetWallet);
        this.web3.eth.clearSubscriptions(this.updateCurrentBlock);
        this.rawProvider = new Web3.providers.HttpProvider(DEFAULT_RPC);
        store.remove('tokenAddress');
        store.remove('token');
        store.remove('connected');
    }

    connect = async () => {
        if (this.connected)
            return true;

        this.web3.eth.clearSubscriptions(this.updateCurrentBlock);
        this.rawProvider = window["ethereum"];
        if (!this.rawProvider) {
            toast.error('Metamask is not installed');
            return false;
        }
        return await this.initProvider();
    }

    private initProvider = async () => {
        await this.rawProvider.enable();
        let chainId = await this.web3.eth.getChainId();

        try {
            await this.rawProvider.request({ method: 'wallet_addEthereumChain', params: [ chainParameters ] });
            chainId = await this.web3.eth.getChainId();
        } catch (e) {}

        if (chainId !== CHAIN_ID) {
            toast.error(`Please switch to BSC Test network`);
            await this.resetWallet();
            return false;
        }

        const accounts = await this.web3.eth.getAccounts();
        if (store.get('tokenAddress') !== accounts[0] || !store.get('token')) {
            const { nonce, signature } = await generateSignature('SignIn', accounts[0]);
            const token = await this.rootStore.api.signIn(nonce, signature);
            store.set('tokenAddress', accounts[0]);
            store.set('token', token);
        }
        runInAction(() => { this.address = accounts[0]; this.connected = true });
        this.rootStore.modalStore.hideAllModals();
        await this.loadProfile();
        store.set('connected', true);
        this.rawProvider?.on?.('accountsChanged', this.resetWallet)
        this.rawProvider?.on?.('chainChanged', this.resetWallet);
        this.rawProvider?.on?.('disconnected', this.resetWallet);
        this.web3.eth.subscribe('newBlockHeaders', this.updateCurrentBlock);
        return true;
    }

    private get web3(): Web3 {
        return new Web3(this.rawProvider);
    }

    signMessage = async (message: string, address?: string) => {
        return await this.web3.eth.personal.sign(message, address || this.address, '');
    }

    sendFunds = async (to: string, amount: BN) => {
        return this.web3.eth.sendTransaction({
            to,
            value: amount.times('1e18').toFixed(0),
            from: this.address,
            gas: 21000,
        });
    }

    get paymentToken() {
        return new this.web3.eth.Contract(PAYMENT_TOKEN_ABI as any, CONTRACT_ADDRESSES.payment_token) as unknown as PaymentTokenContext;
    }

    get deposit() {
        return new this.web3.eth.Contract(DEPOSIT_ABI as any, CONTRACT_ADDRESSES.deposit) as unknown as DepositContext;
    }

    get nft() {
        return new this.web3.eth.Contract(NFT_ABI as any, CONTRACT_ADDRESSES.nft) as unknown as NFTContext;
    }

    get storage() {
        return new this.web3.eth.Contract(STORAGE_ABI as any, CONTRACT_ADDRESSES.storage) as unknown as StorageContext;
    }

    @action notifyUpdate = () => {
        this.updateNotification = Math.random();
    }
}

export { CONTRACT_ADDRESSES };
