import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Novel, NovelRating, AdvertisementComment, Volume, Chapter } from '../models/models';


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

    createNovelRating(rate: NovelRating) {
      const url = `${ this.urlnovelsdb }/create-novel-rating`;
      return this.http.post(url, rate, this.GlobalhttpOptions);
    }

    updateNovelRating(rate: NovelRating) {
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

    deleteNovelRatingComment(id: number) {
      const url = `${ this.urlnovelsdb }/delete-novel-rating-comment/${id}`;
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

    getAdvertisements() {
      const url = `${ this.urlnovelsdb }/get-advertisements`;
      return this.http.get( url );
    }

    getAdvertisement(id: number) {
      const url = `${ this.urlnovelsdb }/get-advertisement/${id}`;
      return this.http.get( url );
    }

    createAdvertisementComment(advertisementComment: AdvertisementComment) {
      const url = `${ this.urlnovelsdb }/create-advertisement-comment`;
      return this.http.post(url, advertisementComment, this.GlobalhttpOptions);
    }

    updateAdvertisementComment(rate: AdvertisementComment) {
      const url = `${ this.urlnovelsdb }/update-advertisement-comment`;
      return this.http.put(url , rate, this.GlobalhttpOptions);
    }

    deleteAdvertisementComment(id: number) {
      const url = `${ this.urlnovelsdb }/delete-advertisement-comment/${id}`;
      return this.http.delete(url, this.GlobalhttpOptions);
    }

    createAdvertisementCommentReply(ratingComment: any) {
      const url = `${ this.urlnovelsdb }/create-advertisement-comment-reply`;
      return this.http.post(url, ratingComment, this.GlobalhttpOptions);
    }

    getAdvertisementCommentReplys(id: number) {
      const url = `${ this.urlnovelsdb }/get-advertisement-comment-replys/${id}`;
      return this.http.get(url);
    }

    updateAdvertisementCommentReply(ratingComment: any) {
      const url = `${ this.urlnovelsdb }/update-advertisement-comment-reply`;
      return this.http.put(url , ratingComment, this.GlobalhttpOptions);
    }

    deleteAdvertisementCommentReply(id: number) {
      const url = `${ this.urlnovelsdb }/delete-advertisement-comment-reply/${id}`;
      return this.http.delete(url, this.GlobalhttpOptions);
    }
}
