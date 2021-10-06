import { Inject, Injectable, isDevMode, PLATFORM_ID } from '@angular/core';
// import { io } from 'socket.io-client'
import { Observable } from 'rxjs';
import { Dev, Prod } from '../config/config';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket: any;
  uri: string ;
  isBrowser: boolean;

  constructor(private dev: Dev,
              private prod: Prod,
              @Inject(PLATFORM_ID) private platformId) { 
                this.isBrowser = isPlatformBrowser(this.platformId);

    /*if (isDevMode()) {
      this.uri = this.dev.ws;
    } else {
      // this.uri = this.dev.ws;
      this.uri = this.prod.ws;
    }

    if (this.isBrowser) {
      this.socket = io(this.uri, {
        withCredentials: true,
        forceNew: true
      });
    }
  }

  listen(eventName: string) {
    if (this.isBrowser) {
      return new Observable((subscriber) => {
        this.socket.on(eventName, (data) => {
          subscriber.next(data);
        })
      })
    }
  }

  emit(eventName: string, data: any) {
    if (this.isBrowser) {
      this.socket.emit(eventName, data);
    }  */ 
  }
}
