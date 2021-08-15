import { Injectable, isDevMode } from '@angular/core';
import { io } from 'socket.io-client'
import { Observable } from 'rxjs';
import { Dev, Prod } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket: any;
  uri: string ;

  constructor(private dev: Dev,
              private prod: Prod) { 

    if (isDevMode()) {
      this.uri = this.dev.ws;
    } else {
      this.uri = this.prod.ws;
    }

    this.socket = io(this.uri, {
      withCredentials: true,
      forceNew: true
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
