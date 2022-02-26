import React, { useEffect, useState } from 'react';
import _ from "lodash";
import { observer } from "mobx-react";
import { Redirect, RouteComponentProps } from "react-router";
import { useInjection } from "inversify-react";
import { ModalStore, WalletStore } from "../stores";
import { toast } from "react-toastify";
import { Api } from "../utils/api";
import { Profile, ProfileType } from "../utils/graphql-gqlr";
import { Link } from 'react-router-dom';
import classNames from "classnames";
import ArtworkCard from "../components/artwork/ArtworkCard";
import Button from "../components/Button";
import ClaimableToken from "../components/profile/ClaimableToken";

interface RouteProps {
    query: string;
}

interface IProfilePageProps extends RouteComponentProps<RouteProps> {
}

const ProfilePage = observer(({ match }: IProfilePageProps) => {
    const walletStore = useInjection(WalletStore);
    const modalStore = useInjection(ModalStore);
    const api = useInjection(Api);

    const [ profile, setProfile ] = useState<Profile>();
    const [ tab, setTab ] = useState<'created'|'collected'|'bids'|'claimable'|'auctions'>('created');

    const ownProfile = walletStore.address?.toLowerCase() === profile?.address.toLowerCase();

    const fetchProfile = async (withReset = true) => {
        withReset && setProfile(undefined);
        const query = match.params.query.toLowerCase() === '@me' ? (walletStore.connected ? walletStore.address : null) : match.params.query;
        if (!query)
            return;
        api.getProfile(query).then(res => setProfile(res));
    }

    useEffect(() => {
        fetchProfile();
    }, [match.params.query, walletStore.connected]);

    useEffect(() => {
        fetchProfile(false);
    }, [walletStore.lastBlock, walletStore.updateNotification]);

    if (match.params.query.toLowerCase() === '@me') {
        if (!walletStore.connected) {
            if (!walletStore.initialized)
                return null;
            toast.error('You must be logged in to access this page');
            return <Redirect to='/' />;
        }
    }

    return (
        <main className="main">
            <section className="profile-section">
                <div className="profile-head" style={{ backgroundImage: `url(${profile?.cover})` }}>
                    <div className="container">
                        <div className="profile-head__img">
                            <img src={profile?.avatar || require('../images/user.svg')}/>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="profile">
                        <div className="profile__info">
                            <div className="profile__top">
                                <div className="profile__names">
                                    <h2 className="profile__name">{profile?.name || profile?.address || (match.params.query.toLowerCase() === '@me' ? walletStore.address : match.params.query)}</h2>
                                </div>
                                {profile?.verified && (
                                    <div className="profile__status">
                                        <img src={require('../images/verify.svg')} alt=""/>
                                    </div>
                                )}
                                <div className="profile-buttons">
                                    {ownProfile && <button className="profile-btn" type="button" onClick={() => modalStore.openProfileEdit(fetchProfile)}>
                                        <img src={require('../images/edit.svg')} alt="edit"/>
                                    </button>}
                                    {/*<button className="profile-btn" type="button">
                                        <img src={require('../images/copy.svg')} alt="copy"/>
                                    </button>
                                    <button className="profile-btn" type="button">
                                        <img src={require('../images/send.svg')} alt="send"/>
                                    </button>
                                    <button className="profile-btn" type="button">
                                        <img src={require('../images/menu.svg')} alt="menu"/>
                                    </button>*/}
                                </div>
                            </div>
                            {profile?.username && <span className="profile__second-name">@{profile.username}</span>}
                            {/*<div className="profile__follow">
                                <div className="profile__follow-item">
                                    <span className="profile__follow-title">Following</span>
                                    <span className="profile__follow-num">194</span>
                                </div>
                                <div className="profile__follow-item">
                                    <span className="profile__follow-title">Followers</span>
                                    <span className="profile__follow-num">1435</span>
                                </div>
                            </div>*/}
                            {profile?.bio && (
                                <div className="profile__descr">
                                    <span className="profile__subtitle">BIO</span>
                                    <p className="profile__text">{profile?.bio}</p>
                                </div>
                            )}
                            {(profile?.instagram || profile?.twitter || profile?.twitch || profile?.onlyfans) && (

                            <div className="profile__links">
                                <span className="profile__subtitle">Links</span>
                                    {profile?.instagram && (
                                        <a className="profile__link" target='_blank' href={`https://instagram.com/${profile.instagram}`}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.99834 2.40015C4.91114 2.40015 2.3999 4.91371 2.3999 8.00171V16.0017C2.3999 19.0889 4.91346 21.6001 8.00146 21.6001H16.0015C19.0887 21.6001 21.5999 19.0866 21.5999 15.9986V7.99858C21.5999 4.91138 19.0863 2.40015 15.9983 2.40015H7.99834ZM17.5999 5.60015C18.0415 5.60015 18.3999 5.95855 18.3999 6.40015C18.3999 6.84175 18.0415 7.20015 17.5999 7.20015C17.1583 7.20015 16.7999 6.84175 16.7999 6.40015C16.7999 5.95855 17.1583 5.60015 17.5999 5.60015ZM11.9999 7.20015C14.6471 7.20015 16.7999 9.35295 16.7999 12.0001C16.7999 14.6473 14.6471 16.8001 11.9999 16.8001C9.3527 16.8001 7.1999 14.6473 7.1999 12.0001C7.1999 9.35295 9.3527 7.20015 11.9999 7.20015ZM11.9999 8.80015C11.1512 8.80015 10.3373 9.13729 9.73716 9.7374C9.13704 10.3375 8.7999 11.1515 8.7999 12.0001C8.7999 12.8488 9.13704 13.6628 9.73716 14.2629C10.3373 14.863 11.1512 15.2001 11.9999 15.2001C12.8486 15.2001 13.6625 14.863 14.2626 14.2629C14.8628 13.6628 15.1999 12.8488 15.1999 12.0001C15.1999 11.1515 14.8628 10.3375 14.2626 9.7374C13.6625 9.13729 12.8486 8.80015 11.9999 8.80015Z"/>
                                            </svg>
                                            <span>Instagram</span>
                                        </a>
                                    )}
                                    {profile?.twitter && (
                                        <a className="profile__link" target='_blank' href={`https://twitter.com/${profile.twitter}`}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22.3999 5.54963C21.6343 5.88963 20.8119 6.11843 19.9487 6.22163C20.8303 5.69363 21.5063 4.85763 21.8247 3.86083C21.0007 4.34963 20.0871 4.70483 19.1143 4.89683C18.3359 4.06723 17.2271 3.54883 15.9999 3.54883C13.6431 3.54883 11.7327 5.46003 11.7327 7.81603C11.7327 8.15043 11.7711 8.47683 11.8431 8.78803C8.29672 8.61043 5.15272 6.91123 3.04712 4.32883C2.68072 4.95923 2.47032 5.69203 2.47032 6.47523C2.47032 7.95523 3.22312 9.26163 4.36792 10.0264C3.66872 10.004 3.01032 9.81203 2.43512 9.49283C2.43512 9.51123 2.43512 9.52803 2.43512 9.54643C2.43512 11.6144 3.90552 13.3392 5.85832 13.7304C5.50072 13.828 5.12312 13.88 4.73352 13.88C4.45912 13.88 4.19112 13.8528 3.93112 13.804C4.47432 15.4992 6.05032 16.7336 7.91752 16.768C6.45752 17.9128 4.61752 18.5952 2.61752 18.5952C2.27352 18.5952 1.93352 18.5752 1.59912 18.5352C3.48792 19.7456 5.73032 20.452 8.14072 20.452C15.9903 20.452 20.2815 13.9496 20.2815 8.31043C20.2815 8.12563 20.2775 7.94163 20.2695 7.75843C21.1039 7.15603 21.8279 6.40483 22.3999 5.54963Z"/>
                                            </svg>
                                            <span>Twitter</span>
                                        </a>
                                    )}
                                    {profile?.twitch && (
                                        <a className="profile__link" target='_blank' href={`https://twitch.com/${profile.twitch}`}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4.8002 3.19995L3.2002 6.39995V19.1999H7.2002V21.5999H10.4002L12.8002 19.1999H16.0002L20.8002 14.4V3.19995H4.8002ZM6.4002 4.79995H19.2002V13.5999L16.8002 15.9999H12.0002L9.60019 18.3999V15.9999H6.4002V4.79995ZM10.4002 7.19995V12.7999H12.0002V7.19995H10.4002ZM13.6002 7.19995V12.7999H15.2002V7.19995H13.6002Z" fill="#1F2B38"/>
                                            </svg>
                                            <span>Twitch</span>
                                        </a>
                                    )}
                                    {profile?.onlyfans && (
                                        <a className="profile__link" target='_blank' href={`https://onlyfans.com/${profile.onlyfans}`}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M11.9688 1.01507e-05C9.59646 0.00617267 7.27915 0.715391 5.3097 2.03805C3.34024 3.36071 1.80703 5.23746 0.903787 7.43117C0.000543408 9.62487 -0.232198 12.0371 0.23497 14.363C0.702139 16.6889 1.84825 18.8242 3.5285 20.499C5.20874 22.1738 7.34771 23.313 9.67514 23.7726C12.0026 24.2322 14.414 23.9917 16.6048 23.0813C18.7955 22.171 20.6673 20.6317 21.9836 18.6579C23.2998 16.6842 24.0015 14.3646 24 11.9922C23.9938 8.80684 22.723 5.75427 20.4669 3.50551C18.2109 1.25676 15.1542 -0.00412737 11.9688 1.01507e-05ZM11.9688 22.7455C9.8444 22.7403 7.76914 22.1057 6.00517 20.9218C4.24119 19.7379 2.86763 18.0578 2.05796 16.0937C1.2483 14.1297 1.03885 11.9697 1.45607 9.8866C1.8733 7.80354 2.89848 5.89084 4.40213 4.39009C5.90578 2.88934 7.82045 1.86785 9.90432 1.45465C11.9882 1.04145 14.1478 1.25507 16.1103 2.06852C18.0728 2.88198 19.7503 4.25879 20.9307 6.02504C22.1112 7.7913 22.7418 9.86778 22.7429 11.9922C22.7387 14.846 21.6015 17.5814 19.5811 19.5969C17.5607 21.6124 14.8226 22.743 11.9688 22.7403V22.7455Z" fill="#1F2B38"/>
                                                <path d="M16.9586 11.2183V10.2391C16.9581 9.65774 16.841 9.0824 16.6144 8.54706C16.3878 8.01171 16.0562 7.52722 15.6391 7.12219C14.7962 6.28885 13.6582 5.8221 12.4729 5.82349H11.6677C10.4833 5.82278 9.34639 6.28948 8.50407 7.12219C8.08693 7.52699 7.7554 8.01149 7.52918 8.54693C7.30296 9.08237 7.18666 9.65781 7.18719 10.2391V11.2183L6.63135 12.2209V13.665C6.63234 14.3107 6.76245 14.9496 7.01403 15.5442C7.26561 16.1388 7.63358 16.6771 8.09628 17.1274C9.03862 18.0515 10.3063 18.5683 11.6262 18.5663H12.5223C13.8387 18.5666 15.1026 18.0499 16.0417 17.1274C16.5053 16.6776 16.8739 16.1395 17.126 15.5448C17.3781 14.9501 17.5084 14.3109 17.5093 13.665V12.2209L16.9586 11.2183ZM12.595 15.6495V16.8053C12.5956 16.8901 12.5747 16.9736 12.5343 17.0481C12.4939 17.1226 12.4352 17.1856 12.3638 17.2313H12.1456C12.1198 17.2352 12.0935 17.2352 12.0677 17.2313H12.0158C11.9942 17.2336 11.9724 17.2336 11.9508 17.2313H11.8521C11.7793 17.1846 11.7194 17.1205 11.6776 17.0447C11.6359 16.969 11.6137 16.884 11.6132 16.7975V15.6495C11.3121 15.5326 11.0617 15.3136 10.9058 15.0307C10.7499 14.7479 10.6984 14.4193 10.7604 14.1023C10.8223 13.7853 10.9936 13.5002 11.2445 13.2968C11.4954 13.0935 11.8097 12.9847 12.1326 12.9897H12.1612C12.4841 12.9847 12.7985 13.0935 13.0494 13.2968C13.3002 13.5002 13.4716 13.7853 13.5335 14.1023C13.5954 14.4193 13.5439 14.7479 13.388 15.0307C13.2321 15.3136 12.9817 15.5326 12.6807 15.6495H12.595ZM14.956 11.2495H9.18719V10.2391C9.18783 9.91786 9.25273 9.60002 9.37808 9.30427C9.50343 9.00852 9.68669 8.74084 9.91706 8.517C10.3828 8.05498 11.0117 7.79469 11.6677 7.79232H12.4729C13.129 7.79441 13.7579 8.05474 14.2236 8.517C14.4535 8.7412 14.6364 9.00894 14.7617 9.30461C14.887 9.60028 14.9522 9.91795 14.9534 10.2391L14.956 11.2495Z" fill="#1F2B38"/>
                                            </svg>
                                            <span>OnlyFans</span>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="profile-tabs js-tabs">
                            <div className="profile-tabs__head">
                                <ul className="profile-tabs__buttons js-tabs-nav">
                                    <li className={classNames('profile-tabs__tab', { active: tab === 'created' })} onClick={() => setTab('created')}>Created</li>
                                    <li className={classNames('profile-tabs__tab', { active: tab === 'collected' })} onClick={() => setTab('collected')}>Collected</li>
                                    <li className={classNames('profile-tabs__tab', { active: tab === 'bids' })} onClick={() => setTab('bids')}>Bids</li>
                                    {ownProfile && (
                                        <>
                                            <li className={classNames('profile-tabs__tab', { active: tab === 'auctions' })} onClick={() => setTab('auctions')}>Auctions</li>
                                            <li className={classNames('profile-tabs__tab', { active: tab === 'claimable' })} onClick={() => setTab('claimable')}>Claimable</li>
                                        </>
                                    )}
                                </ul>
                                {/*<div className="profile-tabs__select">
                                    <span>By date:</span>
                                    <select id="profile-tabs" name="tabs">
                                        <option value="from new to old">from new to old</option>
                                        <option value="from new to old">from new to old</option>
                                        <option value="from new to old">from new to old</option>
                                    </select>
                                </div>*/}
                            </div>
                            {tab === 'created' && (
                                <div className="profile-tabs__body js-tabs-content active">
                                    <div className="cards-wrap">
                                        {profile?.artworks.created.map(artwork => (
                                            <ArtworkCard artwork={artwork} key={artwork.id} withModStatus={ownProfile} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {tab === 'collected' && (
                                <div className="profile-tabs__body js-tabs-content active">
                                    <div className="cards-wrap">
                                        {profile?.artworks.collected.map(artwork => (
                                            <ArtworkCard artwork={artwork} key={artwork.id} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {tab === 'auctions' && (
                                <div className="profile-tabs__body js-tabs-content active">
                                    <div className="cards-wrap">
                                        {profile?.artworks.auctions.map(artwork => (
                                            <ArtworkCard artwork={artwork} key={artwork.id} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {tab === 'claimable' && (
                                <div className="profile-tabs__body js-tabs-content active">
                                    <div className="claimable-wrap">
                                        {profile?.claimable.map(token => (
                                            <ClaimableToken token={token} key={token.tokenId} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
});

export default ProfilePage;
