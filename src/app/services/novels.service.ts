import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Novel, NovelRating, Volume, Chapter } from '../models/models';
import { Dev, Prod } from '../config/config';


@Injectable({
  providedIn: 'root'
})

export class NovelsService {

  private urlNovelsDb: string;
  private urlCredentialsNovelsDb: string;
  private GlobalhttpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient,
              private dev: Dev,
              private prod: Prod) {
    if (isDevMode()) {
      this.urlCredentialsNovelsDb = this.dev.urlCredentialsNovelsDb;
      this.urlNovelsDb = this.dev.urlNovelsDb;
    } else {
      this.urlCredentialsNovelsDb = this.prod.urlCredentialsNovelsDb;
      this.urlNovelsDb = this.prod.urlNovelsDb;
    }
  }

    // Novels

    getHome() {
      const url = `${ this.urlNovelsDb }/home`;
      return this.http.get(url);
    }

    getHomeUpdatedNovelChapters(id: number) {
      const url = `${ this.urlNovelsDb }/home-updated-novel-chapters/${id}`;
      return this.http.get(url);
    }

    getNovels() {
      const url = `${ this.urlNovelsDb }/novels`;
      return this.http.get( url );
    }

    getNovel(id: number, action: 'reading' | 'edition') {
      let url: string;
      if (action === 'edition') {
        url = `${ this.urlCredentialsNovelsDb }/novel/${id}/${action}`;
        return this.http.get( url, this.GlobalhttpOptions );
      } else {
        url = `${ this.urlNovelsDb }/novel/${id}/${action}`;
        return this.http.get( url );
      }
    }

    getGenres() {
      const url = `${ this.urlNovelsDb }/genres`;
      return this.http.get( url );
    }

    createNovel(novel: Novel) {
      const url = `${ this.urlCredentialsNovelsDb }/create-novel`;
      return this.http.post(url, novel, this.GlobalhttpOptions);
    }

    updateNovel(novel: Novel) {
      const url = `${ this.urlCredentialsNovelsDb }/update-novel`;
      return this.http.put(url , novel, this.GlobalhttpOptions);
    }

    deleteNovel(id: number) {
      const url = `${ this.urlCredentialsNovelsDb }/delete-novel/${id}`;
      return this.http.delete(url, this.GlobalhttpOptions);
    }

    createChapter(chapter: Chapter) {
      const url = `${ this.urlCredentialsNovelsDb }/create-chapter`;
      return this.http.post(url, chapter, this.GlobalhttpOptions);
    }

    getNovelChapter(id: number) {
      const url = `${ this.urlNovelsDb }/novel-chapter/${id}`;
      return this.http.get(url);
    }

    getNovelChapterEdition(id: number) {
      const url = `${ this.urlCredentialsNovelsDb }/novel-chapter-edition/${id}`;
      return this.http.get(url, this.GlobalhttpOptions);
    }

    getNovelChapters(id: number) {
      const url = `${ this.urlNovelsDb }/novel-chapters/${id}`;
      return this.http.get(url);
    }

    updateChapter(chapter: Chapter) {
      const url = `${ this.urlCredentialsNovelsDb }/update-chapter`;
      return this.http.put(url , chapter, this.GlobalhttpOptions);
    }

    deleteChapter(id: number) {
      const url = `${ this.urlCredentialsNovelsDb }/delete-chapter/${id}`;
      return this.http.delete(url, this.GlobalhttpOptions);
    }

    createNovelRating(rate: NovelRating) {
      const url = `${ this.urlCredentialsNovelsDb }/create-novel-rating`;
      return this.http.post(url, rate, this.GlobalhttpOptions);
    }

    updateNovelRating(rate: NovelRating) {
      const url = `${ this.urlCredentialsNovelsDb }/update-novel-rating`;
      return this.http.put(url , rate, this.GlobalhttpOptions);
    }

    deleteNovelRating(id: number) {
      const url = `${ this.urlCredentialsNovelsDb }/delete-novel-rating/${id}`;
      return this.http.delete(url, this.GlobalhttpOptions);
    }

    createNovelVolume(vlmTitle: string, nvlId: number) {
      const volume: Volume = {
        vlm_title: vlmTitle,
        nvl_id: nvlId
      };
      const url = `${ this.urlCredentialsNovelsDb }/create-novel-volume`;
      return this.http.post(url, volume, this.GlobalhttpOptions);
    }

    updateNovelVolume(volume: Volume) {
      const url = `${ this.urlCredentialsNovelsDb }/update-novel-volume`;
      return this.http.put(url , volume, this.GlobalhttpOptions);
    }

    deleteNovelVolume(id: number) {
      const url = `${ this.urlCredentialsNovelsDb }/delete-novel-volume/${id}`;
      return this.http.delete(url, this.GlobalhttpOptions);
    }
}
