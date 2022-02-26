import "reflect-metadata";
import "babel-polyfill";

import React from 'react';
import ReactDOM from 'react-dom';
import Application from './Application';
// import './sass/main.scss';

ReactDOM.render(
    <Application />,
    document.getElementById('wrapper')
);
