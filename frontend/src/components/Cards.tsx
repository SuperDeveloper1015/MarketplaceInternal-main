import React from 'react';
import _ from "lodash";

interface ICardsProps {
}

interface ICardsState {
}

class Cards extends React.Component<ICardsProps, ICardsState> {
    render() {
        return (
            <div className="cards-wrap">
                {_.range(10).map(i => (
                    <a className="card" href="artwork.html" key={i}>
                        <div className="card__wrap">
                            <div className="card__head" style={{ backgroundImage: require('../images/auctions/1.png') }}>
                                <div className="card-user">
                                    <div className="card-user__img"><img src={require('../images/user.png')}/></div>
                                    <span className="card-user__name">@username</span>
                                </div>
                            </div>
                            <div className="card__body">
                                <h4 className="card__title">WFH - art name</h4>
                                <div className="card__descrioption">
                                    <div className="card-sold">
                                        <span className="card-sold__subtitle">Sold for</span>
                                        <div className="card-sold__inner js-card-inner">
                                            <div className="card-sold__img"><img src={require('../images/lof.svg')} alt="icon"/></div>
                                            <span className="card-sold__text">1.5M</span>
                                            <button className="card-sold__btn js-list-btn" type="button">?</button>
                                            <ul className="card-sold__list js-card-list">
                                                <li className="card-sold__item">
                                                    <div className="card-sold__icon"><img src={require('../images/bnb.png')} alt="icon"/></div>
                                                    <span>150.50</span>
                                                </li>
                                                <li className="card-sold__item">
                                                    <div className="card-sold__icon"><img src={require('../images/usd.png')} alt="icon"/></div>
                                                    <span>12102.07</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="card__time">
                                        <span className="card__subtitle">Ending in</span>
                                        <span className="card__text">05h 02m 41s</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        )
    }
}

export default Cards;