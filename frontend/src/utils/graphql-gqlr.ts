import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Decimal` scalar type represents a python Decimal. */
  Decimal: any;
  /**
   * Create scalar that ignores normal serialization/deserialization, since
   * that will be handled by the multipart request spec
   */
  Upload: any;
};

/** An enumeration. */
export enum AppAuctionStateChoices {
  /** Finished */
  Finished = 'FINISHED',
  /** Pending */
  Pending = 'PENDING',
  /** Running */
  Running = 'RUNNING'
}

export type ArtworkType = {
  auctions?: Maybe<Array<AuctionType>>;
  copies: Scalars['Int'];
  creator?: Maybe<CondensedProfileType>;
  description: Scalars['String'];
  id: Scalars['ID'];
  isVideoPreview?: Maybe<Scalars['Boolean']>;
  minted: Scalars['Boolean'];
  moderationPassed?: Maybe<Scalars['Boolean']>;
  preview?: Maybe<Scalars['String']>;
  previewImage?: Maybe<Scalars['String']>;
  prices?: Maybe<Array<Maybe<Scalars['Decimal']>>>;
  processed: Scalars['Boolean'];
  title: Scalars['String'];
  tokenIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export type ArtworksIndexType = {
  hasMore?: Maybe<Scalars['Boolean']>;
  items?: Maybe<Array<ArtworkType>>;
};

export type AuctionBidType = {
  amount: Scalars['Decimal'];
  id: Scalars['ID'];
  profile?: Maybe<CondensedProfileType>;
  won: Scalars['Boolean'];
};

export type AuctionType = {
  bids?: Maybe<Array<AuctionBidType>>;
  id: Scalars['ID'];
  lastBid?: Maybe<AuctionBidType>;
  owner?: Maybe<CondensedProfileType>;
  startPrice: Scalars['Decimal'];
  state: AppAuctionStateChoices;
  token?: Maybe<TokenType>;
};

export type ClaimTokenMutation = {
  args?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type CloseAuctionMutation = {
  ok?: Maybe<Scalars['Boolean']>;
};

export type CondensedProfileType = {
  address: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  cover?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  username?: Maybe<Scalars['String']>;
};

export type CreateArtworkMutation = {
  artwork?: Maybe<ArtworkType>;
};

export type CreatorsIndexType = {
  hasMore?: Maybe<Scalars['Boolean']>;
  items?: Maybe<Array<CondensedProfileType>>;
};


export type DeleteArtworkMutation = {
  ok?: Maybe<Scalars['Boolean']>;
};

export type MintedTokensByArtworkMutation = {
  ok?: Maybe<Scalars['Boolean']>;
}

export type IndexPageType = {
  featuredArtworks?: Maybe<Array<ArtworkType>>;
  featuredCreators?: Maybe<Array<CondensedProfileType>>;
  liveAuctions?: Maybe<Array<ArtworkType>>;
  topSlider?: Maybe<Array<ArtworkType>>;
};

export type InfoType = {
  kycApi?: Maybe<Scalars['String']>;
  lofPrice?: Maybe<Scalars['Decimal']>;
};

export type MintMutation = {
  args?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Mutation = {
  claimToken?: Maybe<ClaimTokenMutation>;
  closeAuction?: Maybe<CloseAuctionMutation>;
  createArtwork?: Maybe<CreateArtworkMutation>;
  deleteArtwork?: Maybe<DeleteArtworkMutation>;
  addMintedTokensByArtwork? :Maybe<MintedTokensByArtworkMutation>;
  mint?: Maybe<MintMutation>;
  placeBid?: Maybe<PlaceBidMutation>;
  requestWithdraw?: Maybe<RequestWithdrawMutation>;
  signIn?: Maybe<SignInMutation>;
  startAuction?: Maybe<StartAuctionMutation>;
  swap?: Maybe<SwapMutation>;
  updateProfile?: Maybe<UpdateProfileMutation>;
};


export type Mutation_ClaimTokenArgs = {
  tokenId?: Maybe<Scalars['Int']>;
};


export type Mutation_CloseAuctionArgs = {
  auctionId?: Maybe<Scalars['Int']>;
};


export type Mutation_CreateArtworkArgs = {
  censoredFile?: Maybe<Scalars['Upload']>;
  copies: Scalars['Int'];
  description: Scalars['String'];
  originalFile: Scalars['Upload'];
  title: Scalars['String'];
};


export type Mutation_DeleteArtworkArgs = {
  artworkId?: Maybe<Scalars['ID']>;
};

export type Mutation_MintArgs = {
  artwork?: Maybe<Scalars['ID']>;
};


export type Mutation_PlaceBidArgs = {
  amount?: Maybe<Scalars['Decimal']>;
  auctionId?: Maybe<Scalars['Int']>;
};


export type Mutation_RequestWithdrawArgs = {
  address: Scalars['String'];
  amount: Scalars['Decimal'];
  currency: Scalars['String'];
};


export type Mutation_SignInArgs = {
  nonce: Scalars['String'];
  signature: Scalars['String'];
};


export type Mutation_StartAuctionArgs = {
  startPrice?: Maybe<Scalars['Decimal']>;
  tokenId?: Maybe<Scalars['Int']>;
};


export type Mutation_SwapArgs = {
  amount: Scalars['Decimal'];
};


export type Mutation_UpdateProfileArgs = {
  avatar?: Maybe<Scalars['Upload']>;
  bio?: Maybe<Scalars['String']>;
  cover?: Maybe<Scalars['Upload']>;
  email?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  onlyfans?: Maybe<Scalars['String']>;
  removeAvatar?: Maybe<Scalars['Boolean']>;
  removeCover?: Maybe<Scalars['Boolean']>;
  twitch?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type PlaceBidMutation = {
  ok?: Maybe<Scalars['Boolean']>;
};

export type ProfileArtworksType = {
  auctions?: Maybe<Array<ArtworkType>>;
  collected?: Maybe<Array<ArtworkType>>;
  created?: Maybe<Array<ArtworkType>>;
};

export type ProfileType = {
  address: Scalars['String'];
  artworks?: Maybe<ProfileArtworksType>;
  avatar?: Maybe<Scalars['String']>;
  balanceBnb: Scalars['Decimal'];
  balanceLof: Scalars['Decimal'];
  bio?: Maybe<Scalars['String']>;
  blockCreation: Scalars['Boolean'];
  claimable?: Maybe<Array<TokenType>>;
  cover?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  instagram?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  onlyfans?: Maybe<Scalars['String']>;
  twitch?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  verified: Scalars['Boolean'];
};

export type Query = {
  artwork?: Maybe<ArtworkType>;
  artworksIndex?: Maybe<ArtworksIndexType>;
  creatorsIndex?: Maybe<CreatorsIndexType>;
  depositAddress: Scalars['String'];
  indexPage?: Maybe<IndexPageType>;
  info?: Maybe<InfoType>;
  kycToken: Scalars['String'];
  nonce: Scalars['String'];
  profile?: Maybe<ProfileType>;
};


export type Query_ArtworkArgs = {
  id: Scalars['String'];
};


export type Query_ArtworksIndexArgs = {
  auction?: Maybe<Scalars['Boolean']>;
  page?: Maybe<Scalars['Int']>;
  q?: Maybe<Scalars['String']>;
};


export type Query_CreatorsIndexArgs = {
  page?: Maybe<Scalars['Int']>;
  q?: Maybe<Scalars['String']>;
};


export type Query_ProfileArgs = {
  search: Scalars['String'];
};

export type RequestWithdrawMutation = {
  ok?: Maybe<Scalars['Boolean']>;
};

export type SignInMutation = {
  token?: Maybe<Scalars['String']>;
};

export type StartAuctionMutation = {
  ok?: Maybe<Scalars['Boolean']>;
};

export type SwapMutation = {
  ok?: Maybe<Scalars['Boolean']>;
};

export type TokenType = {
  artwork?: Maybe<ArtworkType>;
  copy: Scalars['Int'];
  tokenId: Scalars['Int'];
};

export type UpdateProfileMutation = {
  profile: ProfileType;
};


export type SignInVariables = Exact<{
  nonce: Scalars['String'];
  signature: Scalars['String'];
}>;


export type SignIn = { signIn?: Maybe<Pick<SignInMutation, 'token'>> };

export type UpdateProfileVariables = Exact<{
  name: Scalars['String'];
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  twitch?: Maybe<Scalars['String']>;
  cover?: Maybe<Scalars['Upload']>;
  removeCover?: Maybe<Scalars['Boolean']>;
  avatar?: Maybe<Scalars['Upload']>;
  removeAvatar?: Maybe<Scalars['Boolean']>;
  instagram?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  onlyfans?: Maybe<Scalars['String']>;
}>;


export type UpdateProfile = { updateProfile?: Maybe<{ profile: Profile }> };

export type RequestWithdrawVariables = Exact<{
  amount: Scalars['Decimal'];
  currency: Scalars['String'];
  address: Scalars['String'];
}>;


export type RequestWithdraw = { requestWithdraw?: Maybe<Pick<RequestWithdrawMutation, 'ok'>> };

export type SwapVariables = Exact<{
  amount: Scalars['Decimal'];
}>;


export type Swap = { swap?: Maybe<Pick<SwapMutation, 'ok'>> };

export type CreateArtworkVariables = Exact<{
  originalFile: Scalars['Upload'];
  censoredFile?: Maybe<Scalars['Upload']>;
  title: Scalars['String'];
  description: Scalars['String'];
  copies: Scalars['Int'];
}>;


export type CreateArtwork = { createArtwork?: Maybe<{ artwork?: Maybe<Artwork> }> };

export type DeleteArtworkVariables = Exact<{
  artworkId: Scalars['ID'];
}>;

export type MintedTokensVariablesByArtwork = Exact<{
  artwork: Scalars['Int'];
  mintedTokens: Array<Scalars['Int']>;
}>;

export type MintedTokensByArtwork = { mintedTokensByArtwork?: Maybe<Pick<MintedTokensByArtworkMutation, 'ok'>> };

export type DeleteArtwork = { deleteArtwork?: Maybe<Pick<DeleteArtworkMutation, 'ok'>> };

export type MintVariables = Exact<{
  artwork: Scalars['ID'];
}>;


export type Mint = { mint?: Maybe<Pick<MintMutation, 'args'>> };

export type StartAuctionVariables = Exact<{
  tokenId: Scalars['Int'];
  startPrice: Scalars['Decimal'];
}>;


export type StartAuction = { startAuction?: Maybe<Pick<StartAuctionMutation, 'ok'>> };

export type CloseAuctionVariables = Exact<{
  auctionId: Scalars['Int'];
}>;


export type CloseAuction = { closeAuction?: Maybe<Pick<CloseAuctionMutation, 'ok'>> };

export type ClaimTokenVariables = Exact<{
  tokenId: Scalars['Int'];
}>;


export type ClaimToken = { claimToken?: Maybe<Pick<ClaimTokenMutation, 'args'>> };

export type PlaceBidVariables = Exact<{
  auctionId: Scalars['Int'];
  amount: Scalars['Decimal'];
}>;


export type PlaceBid = { placeBid?: Maybe<Pick<PlaceBidMutation, 'ok'>> };

export type Profile = (
  Pick<ProfileType, 'id' | 'address' | 'username' | 'name' | 'bio' | 'avatar' | 'cover' | 'twitch' | 'instagram' | 'twitter' | 'onlyfans' | 'verified' | 'email' | 'balanceBnb' | 'balanceLof' | 'blockCreation'>
  & { artworks?: Maybe<{ created?: Maybe<Array<Artwork>>, collected?: Maybe<Array<Artwork>>, auctions?: Maybe<Array<Artwork>> }>, claimable?: Maybe<Array<(
    Pick<TokenType, 'tokenId'>
    & { artwork?: Maybe<Artwork> }
  )>> }
);

export type CondensedProfile = Pick<CondensedProfileType, 'id' | 'address' | 'username' | 'name' | 'avatar' | 'bio' | 'cover'>;

export type AuctionBid = (
  Pick<AuctionBidType, 'id' | 'amount' | 'won'>
  & { profile?: Maybe<CondensedProfile> }
);

export type Auction = (
  Pick<AuctionType, 'id' | 'startPrice' | 'state'>
  & { owner?: Maybe<CondensedProfile>, lastBid?: Maybe<AuctionBid>, token?: Maybe<Token> }
);

export type AuctionWithBids = (
  { bids?: Maybe<Array<AuctionBid>> }
  & Auction
);

export type Token = Pick<TokenType, 'tokenId' | 'copy'>;

export type Artwork = (
  Pick<ArtworkType, 'id' | 'previewImage' | 'preview' | 'isVideoPreview' | 'title' | 'description' | 'copies' | 'processed' | 'tokenIds' | 'minted' | 'moderationPassed' | 'prices' >
  & { creator?: Maybe<CondensedProfile>, auctions?: Maybe<Array<Auction>> }
);

export type GetProfileVariables = Exact<{
  query: Scalars['String'];
}>;


export type GetProfile = { profile?: Maybe<Profile> };

export type GetNonceVariables = Exact<{ [key: string]: never; }>;


export type GetNonce = Pick<Query, 'nonce'>;

export type GetDepositAddressVariables = Exact<{ [key: string]: never; }>;


export type GetDepositAddress = Pick<Query, 'depositAddress'>;

export type GetInfoVariables = Exact<{ [key: string]: never; }>;


export type GetInfo = { info?: Maybe<Pick<InfoType, 'lofPrice'>> };

export type GetKycTokenVariables = Exact<{ [key: string]: never; }>;


export type GetKycToken = Pick<Query, 'kycToken'>;

export type GetArtworkVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetArtwork = { artwork?: Maybe<Artwork> };

export type GetIndexPageVariables = Exact<{ [key: string]: never; }>;


export type GetIndexPage = { indexPage?: Maybe<{ liveAuctions?: Maybe<Array<Artwork>>, featuredArtworks?: Maybe<Array<Artwork>>, featuredCreators?: Maybe<Array<CondensedProfile>>, topSlider?: Maybe<Array<Artwork>> }> };

export type CreatorsIndexVariables = Exact<{
  q?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
}>;


export type CreatorsIndex = { creatorsIndex?: Maybe<(
    Pick<CreatorsIndexType, 'hasMore'>
    & { items?: Maybe<Array<CondensedProfile>> }
  )> };

export type ArtworksIndexVariables = Exact<{
  q?: Maybe<Scalars['String']>;
  auction?: Maybe<Scalars['Boolean']>;
  page?: Maybe<Scalars['Int']>;
}>;


export type ArtworksIndex = { artworksIndex?: Maybe<(
    Pick<ArtworksIndexType, 'hasMore'>
    & { items?: Maybe<Array<Artwork>> }
  )> };

export const CondensedProfile = gql`
    fragment condensedProfile on CondensedProfileType {
  id
  address
  username
  name
  avatar
  bio
  cover
}
    `;
export const AuctionBid = gql`
    fragment auctionBid on AuctionBidType {
  id
  profile {
    ...condensedProfile
  }
  amount
  won
}
    ${CondensedProfile}`;
export const Token = gql`
    fragment token on TokenType {
  tokenId
  copy
}
    `;
export const Auction = gql`
    fragment auction on AuctionType {
  id
  owner {
    ...condensedProfile
  }
  startPrice
  lastBid {
    ...auctionBid
  }
  token {
    ...token
  }
  state
}
    ${CondensedProfile}
${AuctionBid}
${Token}`;
export const Artwork = gql`
    fragment artwork on ArtworkType {
  id
  previewImage
  preview
  isVideoPreview
  title
  description
  copies
  creator {
    ...condensedProfile
  }
  processed
  tokenIds
  minted
  moderationPassed
  auctions {
    ...auction
  }
  prices
}
    ${CondensedProfile}
${Auction}`;
export const Profile = gql`
    fragment profile on ProfileType {
  id
  address
  username
  name
  bio
  avatar
  cover
  twitch
  instagram
  twitter
  onlyfans
  verified
  email
  balanceBnb
  balanceLof
  blockCreation
  artworks {
    created {
      ...artwork
    }
    collected {
      ...artwork
    }
    auctions {
      ...artwork
    }
  }
  claimable {
    tokenId
    artwork {
      ...artwork
    }
  }
}
    ${Artwork}`;
export const AuctionWithBids = gql`
    fragment auctionWithBids on AuctionType {
  ...auction
  bids {
    ...auctionBid
  }
}
    ${Auction}
${AuctionBid}`;
export const SignInDocument = gql`
    mutation signIn($nonce: String!, $signature: String!) {
  signIn(nonce: $nonce, signature: $signature) {
    token
  }
}
    `;
export const UpdateProfileDocument = gql`
    mutation updateProfile($name: String!, $username: String, $email: String, $bio: String, $twitch: String, $cover: Upload, $removeCover: Boolean, $avatar: Upload, $removeAvatar: Boolean, $instagram: String, $twitter: String, $onlyfans: String) {
  updateProfile(
    name: $name
    username: $username
    email: $email
    bio: $bio
    twitch: $twitch
    instagram: $instagram
    twitter: $twitter
    onlyfans: $onlyfans
    cover: $cover
    removeCover: $removeCover
    avatar: $avatar
    removeAvatar: $removeAvatar
  ) {
    profile {
      ...profile
    }
  }
}
    ${Profile}`;
export const RequestWithdrawDocument = gql`
    mutation requestWithdraw($amount: Decimal!, $currency: String!, $address: String!) {
  requestWithdraw(amount: $amount, currency: $currency, address: $address) {
    ok
  }
}
    `;
export const SwapDocument = gql`
    mutation swap($amount: Decimal!) {
  swap(amount: $amount) {
    ok
  }
}
    `;
export const CreateArtworkDocument = gql`
    mutation createArtwork($originalFile: Upload!, $censoredFile: Upload, $title: String!, $description: String!, $copies: Int!) {
  createArtwork(
    originalFile: $originalFile
    censoredFile: $censoredFile
    title: $title
    description: $description
    copies: $copies
  ) {
    artwork {
      ...artwork
    }
  }
}
    ${Artwork}`;

export const MintTokensByArtworkDocument = gql`
mutation mintedTokens($artwork: Int!, $mintedTokens: [Int!]!) {
  mintedTokens(
    artwork: $artwork
    mintedTokens: $mintedTokens
  ) {
    ok
  }
}
`;

export const DeleteArtworkDocument = gql`
    mutation deleteArtwork($artwork: ID!) {
  deleteArtwork(artwork: $artwork) {
    ok
  }
}
    `;
export const MintDocument = gql`
    mutation mint($artwork: ID!) {
  mint(artwork: $artwork) {
    args
  }
}
    `;
export const StartAuctionDocument = gql`
    mutation startAuction($tokenId: Int!, $startPrice: Decimal!) {
  startAuction(tokenId: $tokenId, startPrice: $startPrice) {
    ok
  }
}
    `;
export const CloseAuctionDocument = gql`
    mutation closeAuction($auctionId: Int!) {
  closeAuction(auctionId: $auctionId) {
    ok
  }
}
    `;
export const ClaimTokenDocument = gql`
    mutation claimToken($tokenId: Int!) {
  claimToken(tokenId: $tokenId) {
    args
  }
}
    `;
export const PlaceBidDocument = gql`
    mutation placeBid($auctionId: Int!, $amount: Decimal!) {
  placeBid(auctionId: $auctionId, amount: $amount) {
    ok
  }
}
    `;
export const GetProfileDocument = gql`
    query getProfile($query: String!) {
  profile(search: $query) {
    ...profile
  }
}
    ${Profile}`;
export const GetNonceDocument = gql`
    query getNonce {
  nonce
}
    `;
export const GetDepositAddressDocument = gql`
    query getDepositAddress {
  depositAddress
}
    `;
export const GetInfoDocument = gql`
    query getInfo {
  info {
    lofPrice
  }
}
    `;
export const GetKycTokenDocument = gql`
    query getKycToken {
  kycToken
}
    `;
export const GetArtworkDocument = gql`
    query getArtwork($id: String!) {
  artwork(id: $id) {
    ...artwork
  }
}
    ${Artwork}`;
export const GetIndexPageDocument = gql`
    query getIndexPage {
  indexPage {
    liveAuctions {
      ...artwork
    }
    featuredArtworks {
      ...artwork
    }
    featuredCreators {
      ...condensedProfile
    }
    topSlider {
      ...artwork
    }
  }
}
    ${Artwork}
${CondensedProfile}`;
export const CreatorsIndexDocument = gql`
    query creatorsIndex($q: String, $page: Int) {
  creatorsIndex(q: $q, page: $page) {
    items {
      ...condensedProfile
    }
    hasMore
  }
}
    ${CondensedProfile}`;
export const ArtworksIndexDocument = gql`
    query artworksIndex($q: String, $auction: Boolean, $page: Int) {
  artworksIndex(q: $q, auction: $auction, page: $page) {
    items {
      ...artwork
    }
    hasMore
  }
}
    ${Artwork}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    signIn(variables: SignInVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SignIn> {
      return withWrapper((wrappedRequestHeaders) => client.request<SignIn>(SignInDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'signIn');
    },
    updateProfile(variables: UpdateProfileVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateProfile> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateProfile>(UpdateProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateProfile');
    },
    requestWithdraw(variables: RequestWithdrawVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RequestWithdraw> {
      return withWrapper((wrappedRequestHeaders) => client.request<RequestWithdraw>(RequestWithdrawDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'requestWithdraw');
    },
    swap(variables: SwapVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Swap> {
      return withWrapper((wrappedRequestHeaders) => client.request<Swap>(SwapDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'swap');
    },
    createArtwork(variables: CreateArtworkVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateArtwork> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateArtwork>(CreateArtworkDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createArtwork');
    },
    deleteArtwork(variables: DeleteArtworkVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteArtwork> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteArtwork>(DeleteArtworkDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteArtwork');
    },
    mint(variables: MintVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Mint> {
      return withWrapper((wrappedRequestHeaders) => client.request<Mint>(MintDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'mint');
    },
    startAuction(variables: StartAuctionVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<StartAuction> {
      return withWrapper((wrappedRequestHeaders) => client.request<StartAuction>(StartAuctionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'startAuction');
    },
    closeAuction(variables: CloseAuctionVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CloseAuction> {
      return withWrapper((wrappedRequestHeaders) => client.request<CloseAuction>(CloseAuctionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'closeAuction');
    },
    claimToken(variables: ClaimTokenVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ClaimToken> {
      return withWrapper((wrappedRequestHeaders) => client.request<ClaimToken>(ClaimTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'claimToken');
    },
    placeBid(variables: PlaceBidVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PlaceBid> {
      return withWrapper((wrappedRequestHeaders) => client.request<PlaceBid>(PlaceBidDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'placeBid');
    },
    getProfile(variables: GetProfileVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetProfile> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetProfile>(GetProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getProfile');
    },
    getNonce(variables?: GetNonceVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetNonce> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetNonce>(GetNonceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getNonce');
    },
    getDepositAddress(variables?: GetDepositAddressVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetDepositAddress> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetDepositAddress>(GetDepositAddressDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getDepositAddress');
    },
    getInfo(variables?: GetInfoVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetInfo> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetInfo>(GetInfoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getInfo');
    },
    getKycToken(variables?: GetKycTokenVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetKycToken> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetKycToken>(GetKycTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getKycToken');
    },
    getArtwork(variables: GetArtworkVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetArtwork> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetArtwork>(GetArtworkDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getArtwork');
    },
    getIndexPage(variables?: GetIndexPageVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetIndexPage> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetIndexPage>(GetIndexPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getIndexPage');
    },
    creatorsIndex(variables?: CreatorsIndexVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreatorsIndex> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreatorsIndex>(CreatorsIndexDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'creatorsIndex');
    },
    artworksIndex(variables?: ArtworksIndexVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ArtworksIndex> {
      return withWrapper((wrappedRequestHeaders) => client.request<ArtworksIndex>(ArtworksIndexDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'artworksIndex');
    },
    addMintedTokensByArtwork(variables?: MintedTokensVariablesByArtwork, requestHeaders?: Dom.RequestInit["headers"]): Promise<MintedTokensByArtwork> {
      return withWrapper((wrappedRequestHeaders) => client.request<MintedTokensByArtwork>(MintTokensByArtworkDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'mintTokensByArtwork');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;