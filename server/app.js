import express from 'express';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import config from 'config';

let app = express(),
    rawTemplate = fs.readFileSync(path.join(__dirname, '../views/index.hbs'), 'utf8'),
    template = handlebars.compile(rawTemplate),
    templateData = {};

templateData = {
    title: 'Hello world!',
    clientUrl: process.env.NODE_ENV === 'production' ? `http://${config.serverHost}:${config.serverPort}` : `http://${config.webpackHost}:${config.webpackPort}`
};

app.get('*', function (req, res, next) {
    let markup = template(templateData);
    res.send(markup);    
});

function init(port) {
    port = port || process.env.HTTP_PORT || config.serverPort;
    app.listen(port, () => console.log('Server is listening on port ' + port));
}

export default {
    start: init
};