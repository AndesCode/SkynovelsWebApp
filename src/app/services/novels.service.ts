import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Novel, NovelRating, Volume, Chapter } from '../models/models';


@Injectable({
  providedIn: 'root'
})

export class NovelsService {

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

    // Novels

    getHome() {
      const url = `${ this.urlnovelsdb }/home`;
      return this.http.get(url);
    }

    getHomeUpdatedNovelChapters(id: number) {
      const url = `${ this.urlnovelsdb }/home-updated-novel-chapters/${id}`;
      return this.http.get(url);
    }

    getNovels() {
      const url = `${ this.urlnovelsdb }/novels`;
      return this.http.get( url );
    }

    getNovel(id: number, action: 'reading' | 'edition') {
      const url = `${ this.urlnovelsdb }/novel/${id}/${action}`;
      if (action === 'edition') {
        return this.http.get( url, this.GlobalhttpOptions );
      } else {
        return this.http.get( url );
      }
    }

    getGenres() {
      const url = `${ this.urlnovelsdb }/genres`;
      return this.http.get( url );
    }

    createNovel(novel: Novel) {
      const url = `${ this.urlnovelsdb }/create-novel`;
      return this.http.post(url, novel, this.GlobalhttpOptions);
    }

    updateNovel(novel: Novel) {
      const url = `${ this.urlnovelsdb }/update-novel`;
      return this.http.put(url , novel, this.GlobalhttpOptions);
    }

    deleteNovel(id: number) {
      const url = `${ this.urlnovelsdb }/delete-novel/${id}`;
      return this.http.delete(url, this.GlobalhttpOptions);
    }

    createChapter(chapter: Chapter) {
      const url = `${ this.urlnovelsdb }/create-chapter`;
      return this.http.post(url, chapter, this.GlobalhttpOptions);
    }

    getNovelChapter(id: number) {
      const url = `${ this.urlnovelsdb }/novel-chapter/${id}`;
      return this.http.get(url);
    }

    getNovelChapterEdition(id: number) {
      const url = `${ this.urlnovelsdb }/novel-chapter-edition/${id}`;
      return this.http.get(url);
    }

    getNovelChapters(id: number) {
      const url = `${ this.urlnovelsdb }/novel-chapters/${id}`;
      return this.http.get(url);
    }

    updateChapter(chapter: Chapter) {
      const url = `${ this.urlnovelsdb }/update-chapter`;
      return this.http.put(url , chapter, this.GlobalhttpOptions);
    }

    deleteChapter(id: number) {
      const url = `${ this.urlnovelsdb }/delete-chapter/${id}`;
      return this.http.delete(url, this.GlobalhttpOptions);
    }

    createNovelRating(rate: NovelRating) {
      const url = `${ this.urlnovelsdb }/create-novel-rating`;
      return this.http.post(url, rate, this.GlobalhttpOptions);
    }

    updateNovelRating(rate: NovelRating) {
      const url = `${ this.urlnovelsdb }/update-novel-rating`;
      return this.http.put(url , rate, this.GlobalhttpOptions);
    }

    deleteNovelRating(id: number) {
      const url = `${ this.urlnovelsdb }/delete-novel-rating/${id}`;
      return this.http.delete(url, this.GlobalhttpOptions);
    }

    getNovelImage(nvlImg: string) {
      const url = `${ this.urlnovelsdb }/novel/image/${nvlImg}/false`;
      return this.http.get( url, {responseType: 'blob'});
    }

    createNovelVolume(vlmTitle: string, nvlId: number) {
      const volume: Volume = {
        vlm_title: vlmTitle,
        nvl_id: nvlId
      };
      console.log(volume);
      const url = `${ this.urlnovelsdb }/create-novel-volume`;
      return this.http.post(url, volume, this.GlobalhttpOptions);
    }

    updateNovelVolume(volume: Volume) {
      console.log(volume);
      const url = `${ this.urlnovelsdb }/update-novel-volume`;
      return this.http.put(url , volume, this.GlobalhttpOptions);
    }

    deleteNovelVolume(id: number) {
      const url = `${ this.urlnovelsdb }/delete-novel-volume/${id}`;
      return this.http.delete(url, this.GlobalhttpOptions);
    }
}
