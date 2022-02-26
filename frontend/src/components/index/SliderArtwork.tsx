import React from 'react';
import { ArtworkType } from "../../utils/graphql-gqlr";
import { SwiperSlide } from "swiper/react";
import { Link } from 'react-router-dom';
import { fd } from "../../utils/utils";

const SliderArtwork = ({ artwork }: { artwork: ArtworkType }) => {
    return (
        <div className="slide-card">
            <div className="slide-card__wrap" style={{ backgroundImage: `url(${artwork.previewImage})` }}>
                <div className="slide-card__head">
                    <Link className="card-user" to={`/creators/@${artwork.creator.username}`}>
                        <div className="card-user__img"><img src={artwork.creator.avatar || require('../../images/user.svg')}/></div>
                        {artwork.creator.username && <div className="card-user__name">@{artwork.creator.username}</div>}
                    </Link>
                    {/*<Link className="card-user" to={`/creators/@${artwork.creator.username}`}>
                        <span className="card-user__own">Owned by</span>
                        <div className="card-user__img"><img src={require('../../images/user.png')}/></div>
                        <div className="card-user__name">@username</div>
                    </a>*/}
                </div>
                <div className="slide-card__footer">
                    <h3 className="slide-card__title">{artwork.title}</h3>
                    <div className="slide-card__descr">
                        <div className="slide-card__sold">
                            <span className="slide-card__sold-title">{artwork.prices && 'Sold for'}</span>
                            <span className="slide-card__sold-num">{artwork.prices && <>{fd(artwork.prices[0])}{artwork.prices.length > 1 && <>{' ~ '}{fd(artwork.prices[1])}</>} LOF</>}</span>
                        </div>
                        <Link className="btn light" to={`/artworks/${artwork.id}`}>View artwork</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SliderArtwork;
