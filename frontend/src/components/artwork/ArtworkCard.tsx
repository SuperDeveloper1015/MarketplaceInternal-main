import React, { useState } from 'react';
import { ArtworkType } from "../../utils/graphql-gqlr";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { fd, processRequestError } from "../../utils/utils";
import { useInjection } from "inversify-react";
import { ModalStore, WalletStore } from "../../stores";
import classNames from "classnames";
import { Api } from "../../utils/api";
import { toast } from "react-toastify";

const ArtworkCard = observer(({ artwork, withModStatus }: { artwork: ArtworkType, withModStatus?: boolean }) => {
    const walletStore = useInjection(WalletStore);
    const modalStore = useInjection(ModalStore);
    const api = useInjection(Api);

    const [ buttonsMenu, setButtonsMenu ] = useState(false);

    const onDelete = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (!await modalStore.prompt('Are you sure you want to delete this artwork?', 'This action is irreversible'))
            return;

        try {
            await api.deleteArtwork(artwork.id);
            walletStore.notifyUpdate();
            toast.success('Artwork was deleted');
        } catch (e) {
            processRequestError(e);
        }
    }

    return (
        <Link className="card card_profile" to={`/artworks/${artwork.id}`} key={artwork.id}>
            <div className="card__wrap">
                <div className="card__head">
                    {artwork.isVideoPreview ? (
                        <video className='card__head__background' autoPlay muted poster={artwork.previewImage} loop>
                            <source src={artwork.preview} />
                        </video>
                    ) : (
                        <img className='card__head__background' src={artwork.previewImage} />
                    )}
                    <div className="card-user">
                        <div className="card-user__img">
                            <img src={artwork.creator.avatar || require('../../images/user.svg')} />
                        </div>
                        {artwork.creator.username && <span className="card-user__name">@{artwork.creator.username}</span>}
                    </div>
                    <div className="card__head-bottom">
                        {withModStatus ? (
                            artwork.moderationPassed ? (
                                <span className="card__status card__status_approved">Approved</span>
                            ): (
                                artwork.moderationPassed === null ? (
                                    <span className="card__status card__status_modern">On moderation</span>
                                ) : (
                                    <span className="card__status card__status_decl">Declined</span>
                                )
                            )
                        ) : <span />}
                        {withModStatus && !artwork.minted && artwork.creator.id === walletStore.profile?.id && (
                            <div className="card__buttons">
                                <div className={classNames('card__buttons-list', { active: buttonsMenu })}>
                                    {/*<button className="card-menu" type="button">
                                        <img src={require('../../images/clock.svg')} alt="icon"/>
                                    </button>
                                    <button className="card-menu" type="button">
                                        <img src={require('../../images/pen.svg')} alt="icon"/>
                                    </button>*/}
                                    <button className="card-menu" type="button" onClick={onDelete}>
                                        <img src={require('../../images/basket.svg')} alt="icon"/>
                                    </button>
                                </div>
                                <button className={classNames('card-menu', { active: buttonsMenu })} type="button" onClick={e => { e.preventDefault(); setButtonsMenu(!buttonsMenu) }}>
                                    <span/><span/><span/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="card__body">
                    <h4 className="card__title">{artwork.title}</h4>
                    <div className="card__descrioption">
                        <div className="card-sold">
                            <span className="card-sold__subtitle">{artwork.prices ? 'Sold for' : <>&nbsp;</>}</span>
                            <div className="card-sold__inner js-card-inner">
                                {artwork.prices ? (
                                    <>
                                        <div className="card-sold__img">
                                            <img src={require('../../images/lof.svg')} alt="icon"/>
                                        </div>
                                        <span className="card-sold__text">{fd(artwork.prices[0])}{artwork.prices.length > 1 && <>{' ~ '}{fd(artwork.prices[1])}</>}</span>
                                    </>
                                ) : <span className="card-sold__text">&nbsp;</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
});

export default ArtworkCard;
