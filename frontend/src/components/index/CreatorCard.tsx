import React from 'react';
import { Link } from 'react-router-dom';
import { CondensedProfileType } from "../../utils/graphql-gqlr";

const CreatorCard = ({ creator }: { creator: CondensedProfileType }) => {
    return (
        <Link className="creator-card" to={`/creators/@${creator.username}`}>
            <div className="creator-card__wrap">
                <div className="creator-card__head" style={{ backgroundImage: `url(${creator.cover})` }}>
                    <div className="creator-card__img"><img src={creator.avatar || require('../../images/user.svg')}/></div>
                    {/*<div className="creator-card__follows">
                        <div className="creator-card__follow">
                            <span className="creator-card__follow-title">Following</span>
                            <span className="creator-card__follow-num">194</span>
                        </div>
                        <div className="creator-card__follow">
                            <span className="creator-card__follow-title">Followers</span>
                            <span className="creator-card__follow-num">1435</span>
                        </div>
                    </div>*/}
                </div>
                <div className="creator-card__body">
                    <div className="creator-card__info">
                        <div className="user">
                            <span className="user__name">{creator.name}</span>
                            <span className="user__secondname">@{creator.username}</span>
                        </div>
                        {/*<button className="btn secondary" type="button">Follow</button>*/}
                    </div>
                    <p className="creator-card__text">{creator.bio || <>&nbsp;</>}</p>
                </div>
            </div>
        </Link>
    );
}

export default CreatorCard;
