import React from 'react';
import ReactDOM from 'react-dom/server';
import express from 'express';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import config from 'config';
import createStore from 'shared/create-store';
import { addTodo } from 'shared/actions';
import getRoutes from 'shared/routes';
import { Router, match, RoutingContext } from 'react-router';
import { Provider } from 'react-redux';
import { updatePath } from 'redux-simple-router';

const ProviderFactory = React.createFactory(Provider),
      RoutingContextFactory = React.createFactory(RoutingContext);

let app = express(),
    rawTemplate = fs.readFileSync(path.join(__dirname, '../server/views/index.hbs'), 'utf8'),
    template = handlebars.compile(rawTemplate),
    templateData = {},
    initialState = {},
    serverHost = config.serverHost || 'localhost',
    serverPort = config.serverPort || '8000',
    webpackHost = config.webpackHost || 'localhost',
    webpackPort = config.webpackPort || '8001';

templateData = {
    title: 'Hello world!',
    clientUrl: process.env.NODE_ENV === 'production' ? `http://${serverHost}:${serverPort}` : `http://${webpackHost}:${webpackPort}`
};

app.get('*', function (req, res, next) {
    const store = createStore(initialState),
          routes = getRoutes(store);
    console.log('GET ', req.url);

    store.dispatch(addTodo("This is a new todo"));
    store.dispatch(addTodo("This is another new todo"));
    store.dispatch(addTodo("Do something"));
    store.dispatch(addTodo("Do something else"));

    renderRouteToString(routes, store, req.url, (err, redirect, markup) => {
        let state = {
                ...templateData,
                state: JSON.stringify(store.getState()),
                markup
            },
            templateMarkup = template(state);
        res.send(templateMarkup);
    });
});

function fetchAllData(store, routeProps) {
    return Promise.all(routeProps.components.map(component => {
        if (component && component.populateStore) {
            return component.populateStore(store, routeProps);
        }
    }));
}

function renderRouteToString(routes, store, url, callback) {
    match({ routes, location: url }, async function(err, redirect, renderProps) {
        if (err || redirect) {
            callback(err, redirect);
        } else {
            store.dispatch(updatePath(url));

            let markup, renderErr;
            try {
                await fetchAllData(store, renderProps);
                markup = ReactDOM.renderToString(ProviderFactory({store}, RoutingContextFactory(renderProps)));
            } catch(err) {
                renderErr = err;
            }

            callback(renderErr, null, markup);
        }
    });
}

function init(port) {
    port = port || process.env.HTTP_PORT || config.serverPort;
    app.listen(port, () => console.log('Server is listening on port ' + port));
}

export default {
    start: init
};
