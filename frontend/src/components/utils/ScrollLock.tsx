import React, { useEffect } from 'react';

export function ScrollLock() {
    useEffect(() => {
        document.body.classList.add('overflow');
        return () => document.body.classList.remove('overflow');
    })
    return null;
}
