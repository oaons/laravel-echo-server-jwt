let request = require('request');
let url = require('url');
let jwt = require('jsonwebtoken');
import { Channel } from './channel';
import { Log } from './../log';

export class PrivateChannel {
    /**
     * Create a new private channel instance.
     */
    constructor(private options: any) {
        this.request = request;
    }

    /**
     * Request client.
     */
    private request: any;

    authenticate(socket: any, data: any, secret: string): Promise<any> {
        if (data.auth && data.auth.headers && 'Authorization' in data.auth.headers) {
            let auth = data.auth.headers['Authorization'].split(':');
            if (2 === auth.length && 'Bearer' === auth[0].trim()) {
                let token = auth[1].trim();
                try {
                    var { channel_id } = jwt.verify(token, secret);
                    if ('private-' + channel_id === data.channel) {
                        return Promise.resolve(true)
                    }
                    return Promise.reject({reason: 'Invalid channel name. Given: ' + channel_id + ', expected: ' + data.channel, status: 0});
                } catch(err) {
                    return Promise.reject({reason: err.name + ': ' + err.message, status: 0});
                }
            }
        }
        return Promise.reject({reason: 'Invalid auth headers: ' + JSON.stringify((data.auth && data.auth.headers) ? data.auth.headers : {}), status: 0});
    }
}
