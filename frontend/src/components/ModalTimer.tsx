import React from 'react';

interface IModalTimerProps {
}

interface IModalTimerState {
}

class ModalTimer extends React.Component<IModalTimerProps, IModalTimerState> {
    render() {
        return (
            <div className="modal-timer">
                <div className="modal-timer__wrap">
                    <div className="modal-timer__title">Selling will end</div>
                    <div className="modal-timer__inner active">
                        <div className="modal-timer__inputs">
                            <input className="modal-timer__input js-input-data" type="text" placeholder="2020-02-20"/>
                            <input className="modal-timer__input js-input-time" type="text" placeholder="23:45"/>
                        </div>
                        <div className="modal-timer__info">
                            <span className="modal-timer__time">05h 02m 41s</span>
                            <button className="modal-timer__btn js-timer-del" type="button">Delete timer</button>
                        </div>
                    </div>
                    <button className="modal-timer__btn modal-timer__btn_set js-timer-set" type="button">Set timer</button>
                </div>
            </div>
        )
    }
}

export default ModalTimer;
