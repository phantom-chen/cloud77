import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class ChatSocket extends Socket {
    constructor() {
        super({
            url: '',
            options: {
                path: '/canteen-ws',
                upgrade: false,
                extraHeaders: {
                    'Authorization': 'Bearer xxx',
                }
            },
        })
    }
}