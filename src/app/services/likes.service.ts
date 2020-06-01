import { Injectable  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Like } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  private urlnovelsdb: string;
  private GlobalhttpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient) {
    this.urlnovelsdb = '/api';
  }

  createLike(like: Like) {
    const url = `${ this.urlnovelsdb }/create-like`;
    return this.http.post(url, like, this.GlobalhttpOptions);
  }

  deleteLike(id: number) {
    const url = `${this.urlnovelsdb}/delete-like/${id}`;
    return this.http.delete(url, this.GlobalhttpOptions);
  }
}
