import React from 'react';
import _ from "lodash";

interface ICardsCreatorProps {
}

interface ICardsCreatorState {
}

class CardsCreator extends React.Component<ICardsCreatorProps, ICardsCreatorState> {
    render() {
        return (
            <div className="cards-wrap">
                {_.range(10).map(i => (
                    <a className="creator-card" href="profile.html" key={i}>
                        <div className="creator-card__wrap">
                            <div className="creator-card__head" style={{ backgroundImage: require('../images/creators-card/1.png') }}>
                                <div className="creator-card__img"><img src={require('../images/creators-card/user/1.png')}/></div>
                                <div className="creator-card__follows">
                                    <div className="creator-card__follow">
                                        <span className="creator-card__follow-title">Following</span>
                                        <span className="creator-card__follow-num">194</span>
                                    </div>
                                    <div className="creator-card__follow">
                                        <span className="creator-card__follow-title">Followers</span>
                                        <span className="creator-card__follow-num">1435</span>
                                    </div>
                                </div>
                            </div>
                            <div className="creator-card__body">
                                <div className="creator-card__info">
                                    <div className="user">
                                        <span className="user__name">User Name</span>
                                        <span className="user__secondname">@username</span>
                                    </div>
                                    <button className="btn secondary js-follow-btn" type="button">Follow</button>
                                </div>
                                <p className="creator-card__text">Gen art + exp music a sense of rhythm fuels my research and
                                    real time visions becomes quests for parallels...</p>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        )
    }
}

export default CardsCreator;