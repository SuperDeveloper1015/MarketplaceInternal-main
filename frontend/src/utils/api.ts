import { getSdk, Sdk } from "./graphql-gqlr";
import { GraphQLClient } from "graphql-request";
import { createClient, Client } from "urql";
import BN from 'bignumber.js';

export class Api {
    private readonly client: GraphQLClient;
    private readonly sdk: Sdk;

    constructor(uri: string, token?: string) {
        this.client = new GraphQLClient(uri, { headers: { authorization: token || '' } });
        this.sdk = getSdk(this.client);
    }

    async getNonce() {
        const r = await this.sdk.getNonce();
        return r.nonce;
    }

    async signIn(nonce: string, signature: string) {
        const r = await this.sdk.signIn({ nonce, signature });
        return r.signIn.token;
    }

    async updateProfile(name: string, username: string, email: string, bio: string, twitter: string, instagram: string,
                        onlyfans: string, twitch: string,
                        removeAvatar: boolean, removeCover: boolean, avatar?: File, cover?: File) {
        const r = await this.sdk.updateProfile({ name, username, email, bio, twitter, instagram, onlyfans, twitch, avatar, cover, removeAvatar, removeCover });
        return r.updateProfile.profile;
    }

    async getProfile(query: string) {
        const r = await this.sdk.getProfile({ query });
        return r.profile;
    }

    async getDepositAddress() {
        const r = await this.sdk.getDepositAddress();
        return r.depositAddress;
    }

    async requestWithdraw(amount: BN, address: string, currency: 'bnb' | 'lof') {
        await this.sdk.requestWithdraw({ amount: amount.toString(), address, currency });
    }

    async getInfo() {
        const r = await this.sdk.getInfo();
        return r.info;
    }

    async swap(amount: BN) {
        await this.sdk.swap({ amount });
    }

    async getKycToken() {
        const r = await this.sdk.getKycToken();
        return r.kycToken;
    }

    async createArtwork(title: string, description: string, copies: number, originalFile: File, censoredFile?: File) {
        const r = await this.sdk.createArtwork({ title, description, copies, originalFile, censoredFile });
        return r.createArtwork.artwork;
    }

    async deleteArtwork(artworkId: string) {
        await this.sdk.deleteArtwork({ artworkId });
    }

    async getArtwork(id: string) {
        const r = await this.sdk.getArtwork({ id });
        return r.artwork;
    }

    async mint(artwork: string) {
        const r = await this.sdk.mint({ artwork });
        return r.mint.args;
    }

    async createAuction(tokenId: number, startPrice: string) {
        await this.sdk.startAuction({ tokenId, startPrice });
    }

    async closeAuction(auctionId: number) {
        await this.sdk.closeAuction({ auctionId });
    }

    async claimToken(tokenId: number) {
        const r = await this.sdk.claimToken({ tokenId });
        return r.claimToken.args;
    }

    async placeBid(auctionId: number, amount: BN) {
        await this.sdk.placeBid({ auctionId, amount: amount.toString() });
    }

    async artworksIndex(q: string, auction: boolean, page: number) {
        const r = await this.sdk.artworksIndex({ q, auction, page });
        return r.artworksIndex;
    }

    async creatorsIndex(q: string, page: number) {
        const r = await this.sdk.creatorsIndex({ q, page });
        return r.creatorsIndex;
    }

    async getIndexPage() {
        const r = await this.sdk.getIndexPage();
        return r.indexPage;
    }

    async addMintedTokensByArtwork(artwork: number, mintedTokens: number[]) {
        await this.sdk.addMintedTokensByArtwork({ artwork, mintedTokens });
    }
}
