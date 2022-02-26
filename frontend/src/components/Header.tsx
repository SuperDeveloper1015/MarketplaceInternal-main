import React, { useState } from 'react';
import { observer } from "mobx-react";
import { useInjection } from "inversify-react";
import { ModalStore, WalletStore } from "../stores";
import { ModalsEnum } from "../stores/ModalStore";
import classNames from "classnames";
import { Link, NavLink } from 'react-router-dom';
import ClickAwayListener from "react-click-away-listener";
import store from 'store';
import { fd, toBN } from "../utils/utils";

interface IHeaderProps {
}

const Header = observer(() => {
    const modalStore = useInjection(ModalStore);
    const walletStore = useInjection(WalletStore);

    const [ burgerOpen, setBurgerOpen ] = useState(false);
    const [ userOpen, setUserOpen ] = useState(false);

    const onConnect = () => {
        setBurgerOpen(false);
        // if (!store.get('firstConnect'))
            modalStore.showModal(ModalsEnum.Connect);
        // else
        //     walletStore.connect();
        store.set('firstConnect', true);
    }

    const userMenuAction = (..._: any) => {
        setUserOpen(false);
    }

    return (
        <header className="header">
            <div className="container">
                <Link className="logo" to="/"><img src={require('../images/logo-header.svg')} alt="Logo"/></Link>
                <div className={classNames('nav-wrap', { active: burgerOpen })}>
                    <div className="nav-scroll scroll-wrap">
                        <nav className="nav">
                            <ul>
                                <li><NavLink to="/artworks">Artworks</NavLink></li>
                                <li><NavLink to="/creators">Creators</NavLink></li>
                                <li><NavLink to="/about">About</NavLink></li>
                            </ul>
                        </nav>
                        {!walletStore.connected && (
                            <button className="btn light" type="button" onClick={onConnect}>Connect wallet</button>
                        )}
                    </div>
                </div>
                {!walletStore.connected ? (
                    <div className="user-nav">
                        <button className="btn primary" type="button" onClick={onConnect}>Connect wallet</button>
                        <button className="burger" type="button" onClick={() => setBurgerOpen(!burgerOpen)}>
                            <span/><span/><span/>
                        </button>
                    </div>
                ) : (
                    <div className="user-nav user-nav_profile">
                        {!walletStore.profile?.blockCreation && <button className="btn primary" type="button" onClick={() => modalStore.showModal(ModalsEnum.UploadArtwork)}>Add artwork</button>}
                        <button className="user-burger" type="button" onClick={() => setUserOpen(!userOpen)}>
                            <div className="user-burger__img"><img src={walletStore.profile?.avatar || require('../images/user.svg')} alt="user"/></div>
                        </button>
                        <button className="burger" type="button" onClick={() => setBurgerOpen(!burgerOpen)}>
                            <span/><span/><span/>
                        </button>
                        <ClickAwayListener onClickAway={() => userOpen && setUserOpen(false)}>
                            <div className={classNames('user-info', { active: userOpen })}>
                                <div className="user-info__wrap">
                                    <div className="user-info__head js-user-burger" onClick={() => setUserOpen(!userOpen)}>
                                        <div className="user-info__img"><img src={walletStore.profile?.avatar || require('../images/user.svg')}/></div>
                                        <div className="user-info__info">
                                            <span className="user-info__name">{walletStore.profile?.name || walletStore.address}</span>
                                            <div className="user-info__description">
                                                {walletStore.profile?.username && <span className="user-info__second-name">@{walletStore.profile.username}</span>}
                                                <div className="user-info__balance">
                                                    <span className="user-info__text">Balance:</span>
                                                    <div className="user-info__icon">
                                                        <img src={require('../images/lof.svg')} alt="icon"/>
                                                    </div>
                                                    <span className="user-info__sum">{fd(toBN(walletStore.profile?.balanceLof))}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="user-menu">
                                        <div className="user-menu__wrap">
                                            <span className="user-menu__address">Address: {walletStore.address}</span>
                                            <Link className="user-menu__row"
                                                  to='/creators/@me'
                                                  onClick={() => userMenuAction()}>
                                                <span>My profile</span>
                                            </Link>
                                            <a className="user-menu__row"
                                               onClick={() => userMenuAction(modalStore.openProfileEdit())}>
                                                <span>Edit profile</span>
                                            </a>
                                            {!walletStore.profile?.verified && (
                                                <a className="user-menu__row js-open-verification"
                                                   onClick={() => userMenuAction(modalStore.showModal(ModalsEnum.Verification))}>
                                                    <span>Verification</span>
                                                    <span className="user-menu__info">Not verified</span>
                                                </a>
                                            )}
                                            <a className="user-menu__row"
                                               onClick={() => userMenuAction(modalStore.showModal(ModalsEnum.Balance))}>
                                                <span>Balance settings</span>
                                            </a>
                                            <a className="user-menu__out"
                                               onClick={() => userMenuAction(walletStore.resetWallet())}>
                                                Log out
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ClickAwayListener>
                    </div>
                )}
            </div>
        </header>
    )
})

export default Header;
