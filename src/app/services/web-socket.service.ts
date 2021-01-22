import { Injectable } from '@angular/core';
import {io} from 'socket.io-client'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket: any;
  readonly uri = 'ws://localhost:3000'

  constructor() { 
    this.socket = io(this.uri, {
      withCredentials: true,
      /*extraHeaders: {
        "my-custom-header": "abcd"
        }*/
      });
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      })
    })
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
