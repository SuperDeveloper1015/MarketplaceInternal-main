import React, { useState } from 'react';
import classNames from "classnames";
import ClickAwayListener from "react-click-away-listener";

type NiceSelectOption = {
    value: any;
    label: string;
}

interface INiceSelectProps {
    options: NiceSelectOption[];
    className?: string;
    value: any;
    onChange: (value: string) => any;
}

const NiceSelect = ({ options, className, value, onChange }: INiceSelectProps) => {
    const [ open, setOpen ] = useState(false);

    return (
        <ClickAwayListener onClickAway={() => open && setOpen(!open)}>
            <div className={classNames('nice-select', className, { open })} onClick={() => setOpen(!open)}>
                <span className="current">{options.filter(op => op.value === value)[0].label}</span>
                <ul className="list open">
                    {options.map(op => (
                        <li
                            className={classNames('option', { selected: op.value === value })}
                            key={op.value}
                            onClick={() => { onChange(op.value); setOpen(false); }}
                        >
                            {op.label}
                        </li>
                    ))}
                </ul>
            </div>
        </ClickAwayListener>
    )
};

export default NiceSelect;
