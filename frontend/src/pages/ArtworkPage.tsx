import React, { useEffect, useState } from "react";
import { ArtworkType } from "../utils/graphql-gqlr";
import { RouteComponentProps } from "react-router";
import { useInjection } from "inversify-react";
import { ModalStore, WalletStore } from "../stores";
import { Api } from "../utils/api";
import { observer } from "mobx-react";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { processRequestError } from "../utils/utils";
import CONTRACT_ADDRESSES from "../../../contracts/addresses.json";
import { ModalsEnum } from "../stores/ModalStore";
import ArtworkAuction from "../components/artwork/ArtworkAuction";
import { Link } from "react-router-dom";
import ClickAwayListener from "react-click-away-listener";
import classNames from "classnames";
import { RouterStore } from "mobx-react-router";
import { TokenKind } from "graphql";

interface RouteProps {
    artworkId: string;
}

interface IArtworkPageProps extends RouteComponentProps<RouteProps> {
}

const ArtworkPage = observer(({ match: { params: { artworkId } } }: IArtworkPageProps) => {
    const walletStore = useInjection(WalletStore);
    const modalStore = useInjection(ModalStore);
    const routerStore = useInjection(RouterStore);
    const api = useInjection(Api);

    const [artwork, setArtwork] = useState<ArtworkType>();
    // const [ownedTokens, setOwnedTokens] = useState<number[]>();
    const [ownedTokens, setOwnedTokens] = useState([0]);
    const [mintLoading, setMintLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        (async () => {
            setArtwork(await api.getArtwork(artworkId));
        })();
    }, [artworkId, walletStore.lastBlock, walletStore.updateNotification]);

    useEffect(() => {
        if (!walletStore.address || !artwork)
            return;
        (async () => {
            const allOwnedTokens = (await walletStore.nft.methods.ownedTokensByUser(walletStore.address).call()).map(tokenId => parseInt(tokenId, 16));
            setOwnedTokens(allOwnedTokens.filter(tokenId => artwork.tokenIds.includes(tokenId)));
        })();
    }, [artworkId, artwork, walletStore.lastBlock, walletStore.connected, walletStore.address]);

    const onMint = async () => {
        setMintLoading(true);
        try {
            const nft = walletStore.nft;
            const [amount, uuid, sig] = await api.mint(artworkId);
            const tokensBefore = (await walletStore.nft.methods.ownedTokensByUser(walletStore.address).call()).map(tokenId => parseInt(tokenId, 16));
            await nft.methods.mint(amount, uuid, sig).send({ from: walletStore.address });
            const tokensAfter = (await walletStore.nft.methods.ownedTokensByUser(walletStore.address).call()).map(tokenId => parseInt(tokenId, 16));
            //This might not be great, but it works
            const tokensMinted = tokensAfter.filter(n => !tokensBefore.includes(n))
            await api.addMintedTokensByArtwork(parseInt(artworkId), tokensMinted);
            toast.success('Mint transaction sent');
        } catch (e) {
            processRequestError(e);
        } finally {
            setMintLoading(false);
        }
    }

    const onDelete = async () => {
        setMenuOpen(false);

        if (!await modalStore.prompt('Are you sure you want to delete this artwork?', 'This action is irreversible'))
            return;

        try {
            await api.deleteArtwork(artwork.id);
            walletStore.notifyUpdate();
            routerStore.push('/creators/@me')
            toast.success('Artwork was deleted');
        } catch (e) {
            processRequestError(e);
        }
    }

    return (
        <main className="main">
            <section className="atwork-section">
                <div className="container">
                    <div className="atwork">
                        <div className="atwork__img">
                            {artwork?.processed && (
                                artwork.isVideoPreview ? (
                                    <video controls autoPlay loop poster={artwork.previewImage}>
                                        <source src={artwork.preview} />
                                    </video>
                                ) : (
                                    artwork.preview ? <img src={artwork.preview} /> : 'Processing...'
                                )
                            )}
                        </div>
                        <div className="atwork__inner">
                            <div className="atwork__user">
                                <div className="atwork__user-img">
                                    <img src={artwork?.creator.avatar || require('../images/user.svg')} />
                                </div>
                                {artwork?.creator.username && <Link to={`/creators/@${artwork.creator.username}`} className="atwork__user-name">@{artwork.creator.username}</Link>}
                            </div>
                            <div className="atwork__head">
                                <h2 className="atwork__title">{artwork?.title}</h2>
                                <div className="profile-buttons">
                                    {artwork?.moderationPassed || artwork?.minted ? (
                                        <button className="profile-btn" type="button" onClick={() => modalStore.showModal(ModalsEnum.Share, document.location.href)}>
                                            <img src={require('../images/send.svg')} alt="send" />
                                        </button>
                                    ) : (
                                        <div className='profile-menu-wrapper'>
                                            <button className="profile-btn" type="button" onClick={() => setMenuOpen(true)}>
                                                <img src={require('../images/menu.svg')} alt="menu" />
                                            </button>
                                            <ClickAwayListener onClickAway={() => menuOpen && setMenuOpen(false)}>
                                                <div className={classNames('profile-menu', { active: menuOpen })}>
                                                    <ul>
                                                        <li onClick={onDelete}>Delete</li>
                                                    </ul>
                                                </div>
                                            </ClickAwayListener>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="atwork__status">
                                <div className="atwork__status-item"><span>Category:</span><span>Category</span></div>
                                <div className="atwork__status-item"><span>Copies: </span><span>{artwork?.copies}</span></div>
                            </div>
                            <div className="atwork__description">
                                <span>Description:</span>{' '}
                                <p className='pre'>{artwork?.description}</p>
                            </div>
                            {artwork?.creator.address === walletStore.address && artwork?.moderationPassed && !artwork.minted && (
                                <Button className='primary' loading={mintLoading} onClick={onMint}>Mint</Button>
                            )}
                            {artwork?.auctions.length > 0 && artwork?.auctions.map(auction => (
                                <ArtworkAuction auction={auction} key={auction.id} />
                            ))}
                            {/* {ownedTokens?.length == 0 && ( */}
                            {ownedTokens?.length > 0 && (
                                <div className="activity">
                                    <h3 className="activity__title">Owned tokens</h3>
                                    <div className="activity__inner">
                                        {ownedTokens.map(tokenId => (
                                            <div className="activity__block" key={tokenId}>
                                                <div className="activity__description">
                                                    <div className="activity__text">
                                                        <a href={`https://testnet.bscscan.com/token/${CONTRACT_ADDRESSES.nft}?a=${tokenId}`} target='_blank' className="activity__id">
                                                            Token ID: {tokenId}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="activity__info">
                                                    <Button className='primary' onClick={() => modalStore.showModal(ModalsEnum.CreateAuction, tokenId)}>Start Auction</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            )}
                            {/*<div className="atwork__bit">
                                <div className="card-sold">
                                    <span className="card-sold__subtitle">Sold for</span>
                                    <div className="card-sold__inner js-card-inner">
                                        <div className="card-sold__img">
                                            <img src={require('../images/lof.svg')} alt="icon"/>
                                        </div>
                                        <span className="card-sold__text">1.5M</span>
                                        <button className="card-sold__btn js-list-btn" type="button">?</button>
                                        <ul className="card-sold__list js-card-list">
                                            <li className="card-sold__item">
                                                <div className="card-sold__icon">
                                                    <img src={require('../images/bnb.png')} alt="icon"/>
                                                </div>
                                                <span>150.50</span>
                                            </li>
                                            <li className="card-sold__item">
                                                <div className="card-sold__icon">
                                                    <img src={require('../images/usd.png')} alt="icon"/>
                                                </div>
                                                <span>12102.07</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="atwork__timer">
                                    <div className="atwork__time">
                                        <span className="atwork__hours">1</span>
                                        <span>hours</span>
                                    </div>
                                    <div className="atwork__time">
                                        <span className="atwork__minutes">28</span>
                                        <span>minutes</span>
                                    </div>
                                    <div className="atwork__time">
                                        <span className="atwork__seconds">32</span>
                                        <span>seconds</span>
                                    </div>
                                </div>
                                <button className="btn primary js-open-bid" type="button">Place a bid</button>
                            </div>
                            <div className="activity">
                                <h3 className="activity__title">Activity</h3>
                                <div className="activity__inner">
                                    <div className="activity__block">
                                        <div className="activity__description">
                                            <div className="activity__img">
                                                <img src={require('../images/users/2.png')} alt="user"/>
                                            </div>
                                            <div className="activity__text">
                                                <span className="activity__id">Bid placed by 0x6FC0...14A4</span>
                                                <span
                                                className="activity__data">May 19, 2021 at 2:27pm</span>
                                            </div>
                                        </div>
                                        <div className="activity__info">
                                            <div className="card-sold">
                                                <div className="card-sold__inner js-card-inner">
                                                    <div className="card-sold__img">
                                                        <img src={require('../images/lof.svg')} alt="icon"/>
                                                    </div>
                                                    <span className="card-sold__text">1.5M</span>
                                                    <button className="card-sold__btn js-list-btn" type="button">?</button>
                                                    <ul className="card-sold__list js-card-list">
                                                        <li className="card-sold__item">
                                                            <div className="card-sold__icon">
                                                                <img src={require('../images/bnb.png')} alt="icon"/>
                                                            </div>
                                                            <span>150.50</span>
                                                        </li>
                                                        <li className="card-sold__item">
                                                            <div className="card-sold__icon">
                                                                <img src={require('../images/usd.png')} alt="icon"/>
                                                            </div>
                                                            <span>12102.07</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <button className="profile-btn" type="button">
                                                <img src={require('../images/copy.svg')} alt="copy"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>*/}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
});

export default ArtworkPage;
