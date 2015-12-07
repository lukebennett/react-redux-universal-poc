import React from 'react';
import reactStamp from 'react-stamp';
import { Route } from 'react-router';
import { default as App } from './containers/App';

export default (
    <Route path="/" component={App}>
        <Route path=":todoIndex" component={App}/>
    </Route>
);