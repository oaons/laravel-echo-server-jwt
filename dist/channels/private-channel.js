"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateChannel = void 0;
var request = require('request');
var url = require('url');
var jwt = require('jsonwebtoken');
var PrivateChannel = (function () {
    function PrivateChannel(options) {
        this.options = options;
        this.request = request;
    }
    PrivateChannel.prototype.authenticate = function (socket, data, secret) {
        if (data.auth && data.auth.headers && 'Authorization' in data.auth.headers) {
            var auth = data.auth.headers['Authorization'].split(':');
            if (2 === auth.length && 'Bearer' === auth[0].trim()) {
                var token = auth[1].trim();
                try {
                    var channel_id = jwt.verify(token, secret).channel_id;
                    if ('private-' + channel_id === data.channel) {
                        return Promise.resolve(true);
                    }
                    return Promise.reject({ reason: 'Invalid channel name. Given: ' + channel_id + ', expected: ' + data.channel, status: 0 });
                }
                catch (err) {
                    return Promise.reject({ reason: err.name + ': ' + err.message, status: 0 });
                }
            }
        }
        return Promise.reject({ reason: 'Invalid auth headers: ' + JSON.stringify((data.auth && data.auth.headers) ? data.auth.headers : {}), status: 0 });
    };
    return PrivateChannel;
}());
exports.PrivateChannel = PrivateChannel;
