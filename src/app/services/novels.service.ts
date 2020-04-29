import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Novel } from '../models/models';
import { Volume } from '../models/volume';
import { Chapter } from '../models/chapter';


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

    getNovels() {
      const url = `${ this.urlnovelsdb }/novels`;
      return this.http.get( url );
    }

    getNovel(id: number, action: string) {
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

    createChapterComment(chapterComment: any) {
      const url = `${ this.urlnovelsdb }/create-chapter-comment`;
      return this.http.post(url, chapterComment, this.GlobalhttpOptions);
    }

    getChapterComments(id: number) {
      const url = `${ this.urlnovelsdb }/get-chapters-comments/${id}`;
      return this.http.get(url);
    }

    updateChapterComment(chapterComment: any) {
      const url = `${ this.urlnovelsdb }/update-chapter-comment`;
      return this.http.put(url , chapterComment, this.GlobalhttpOptions);
    }

    deleteChapterComment(id: number) {
      const url = `${ this.urlnovelsdb }/delete-chapter-comment/${id}`;
      return this.http.delete(url, this.GlobalhttpOptions);
    }

    createChapterCommentReply(chapterCommentReply: any) {
      const url = `${ this.urlnovelsdb }/create-chapter-comment-reply`;
      return this.http.post(url, chapterCommentReply, this.GlobalhttpOptions);
    }

    getChapterCommentReplys(id: number) {
      const url = `${ this.urlnovelsdb }/get-chapter-comment-replys/${id}`;
      return this.http.get(url);
    }

    updateChapterCommentReply(chapterCommentReply: any) {
      const url = `${ this.urlnovelsdb }/update-chapter-comment-reply`;
      return this.http.put(url , chapterCommentReply, this.GlobalhttpOptions);
    }

    deleteChapterCommentReply(id: number) {
      const url = `${ this.urlnovelsdb }/delete-chapter-comment-reply/${id}`;
      return this.http.delete(url, this.GlobalhttpOptions);
    }

    createNovelRating(rate: any) {
      const url = `${ this.urlnovelsdb }/create-novel-rating`;
      return this.http.post(url, rate, this.GlobalhttpOptions);
    }

    updateNovelRating(rate: any) {
      const url = `${ this.urlnovelsdb }/update-novel-rating`;
      return this.http.put(url , rate, this.GlobalhttpOptions);
    }

    deleteNovelRating(id: string) {
      const url = `${ this.urlnovelsdb }/delete-novel-rating/${id}`;
      return this.http.delete(url, this.GlobalhttpOptions);
    }

    createNovelRatingComment(ratingComment: any) {
      const url = `${ this.urlnovelsdb }/create-novel-rating-comment`;
      return this.http.post(url, ratingComment, this.GlobalhttpOptions);
    }

    getNovelRatingComments(id: number) {
      const url = `${ this.urlnovelsdb }/get-novel-rating-comments/${id}`;
      return this.http.get(url);
    }

    updateNovelRatingComment(ratingComment: any) {
      const url = `${ this.urlnovelsdb }/update-novel-rating-comment`;
      return this.http.put(url , ratingComment, this.GlobalhttpOptions);
    }

    deleteNovelRatingComment(id: string) {
      const url = `${ this.urlnovelsdb }/delete-novel-rating-comment/${id}`;
      return this.http.delete(url, this.GlobalhttpOptions);
    }

    getNovelImage(nvl_img: string) {
      const url = `${ this.urlnovelsdb }/novel/image/${nvl_img}/false`;
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
