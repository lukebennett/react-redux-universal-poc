import React from 'react';
import reactStamp from 'react-stamp';
import { Router, Route } from 'react-router';
import { default as App } from './containers/App';

export default (store, history) => {
    function createElement(Component, props) {
        if (Component.populateStore) {
            Component.populateStore(store, props);
        }
        return React.createElement(Component, props);
    }

    return <Router history={history} createElement={createElement}>
        <Route path="/" component={App}>
            <Route path=":todoIndex" component={App}/>
        </Route>
    </Router>;
};