import React from 'react';
import classNames from "classnames";

interface IButtonProps extends React.ButtonHTMLAttributes<any> {
    loading?: boolean;
}

interface IButtonState {
}

class Button extends React.Component<IButtonProps, IButtonState> {
    render() {
        const { loading, className, children, disabled, ...rest } = this.props;
        return (
            <button className={classNames('btn', { loading }, className)} {...rest} disabled={loading || disabled}>
                {loading && (
                    <svg className="spinner" viewBox="0 0 50 50">
                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"/>
                    </svg>
                )}
                {children}
            </button>
        )
    }
}

export default Button;
