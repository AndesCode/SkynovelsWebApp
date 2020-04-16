import { Injectable, EventEmitter  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, UpdatePass } from '../models/user';
import { Observable } from 'rxjs';
import { Novel } from '../models/novel';
import { Chapter } from '../models/chapter';
import { Post } from '../models/post';
import { PostComment } from '../models/post-comment';





@Injectable({
  providedIn: 'root'
})
export class AppService {

  private urlnovelsdb = 'http://localhost:3000';

  invokeExternalFunction = new EventEmitter();
  sendCurrentComponnent = new EventEmitter();

  constructor(private http: HttpClient) { }

  /**
  * Abrir funciones llamadas desde otros componentes.
  * @param functionCalled String a recibir (string que verificaran los componentes finales).
  */
  openExternalFunction(functionCalled: string) {
    this.invokeExternalFunction.emit(functionCalled);
  }

  getCurrentComponent(component: any) {
    this.sendCurrentComponnent.emit(component);
  }

// Non HTTP functions

  /**
  * Esta función esta diseñada para recibir los datos "createdAt" y "updatedAt" y devolverlos junto a otros datos en formato legible.
  * En caso de no existir alguno de estos dos, puede recibir null.
  * Devuelve un objeto con datos utilizables en los componentes que llamen esta función.
  * @param req_creation_date createdAt de un objeto.
  * @param req_update_date updatedAt de un objeto.
  */
  getDiferenceInDaysBetweenDays(req_creation_date: any, req_update_date: any) {
    // console.log(req_creation_date);
    // console.log(req_update_date);
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const today_date = dd + '/' + mm + '/' + yyyy;


      let creation_date_format = null;
      let update_date_format = null;
      let creation_date = null;
      let update_date = null;
      let creation_date_diffDays = null;
      let update_date_diffDays = null;
      if (req_creation_date) {
        creation_date = new Date(req_creation_date);
        const creation_date_day = String(creation_date.getDate()).padStart(2, '0');
        const creation_date_month = String(creation_date.getMonth() + 1).padStart(2, '0');
        const creation_date_year = creation_date.getFullYear();
        creation_date_format = creation_date_day + '/' + creation_date_month + '/' + creation_date_year;
        const creation_date_diff = Math.abs(today.getTime() - creation_date.getTime());
        creation_date_diffDays = Math.ceil((creation_date_diff / (1000 * 3600 * 24)) - 1);
      }
      if (req_update_date) {
        update_date = new Date(req_update_date);
        const update_day = String(update_date.getDate()).padStart(2, '0');
        const update_month = String(update_date.getMonth() + 1).padStart(2, '0');
        const update_year = update_date.getFullYear();
        update_date_format = update_day + '/' + update_month + '/' + update_year;
        const update_date_diff = Math.abs(today.getTime() - update_date.getTime());
        update_date_diffDays = Math.ceil((update_date_diff / (1000 * 3600 * 24)) - 1);
      }

      const date_data = {
        today_date: today_date,
        update_date: update_date_format,
        creation_date: creation_date_format,
        creation_date_days: creation_date_diffDays,
        update_date_days: update_date_diffDays,
        update_date_message: null,
        creation_date_message: null
      };
      // if (date.updatedAt === date.createdAt)
      if ( date_data.creation_date === date_data.today_date && date_data.creation_date === date_data.update_date) {
        date_data.update_date_message = 'Actualizado Hoy';
        date_data.creation_date_message = 'Hoy';
      } else {
        if (req_update_date !== null) {
          let update_days = '';
          if (date_data.update_date_days > 1) {
            update_days = 'Actualizado hace ' + date_data.update_date_days + ' dias';
          } else {
            update_days = 'Actualizado hace ' + date_data.update_date_days + ' dia';
            if (date_data.update_date_days === 0) {
              update_days = 'Actualizado hace menos de 24 horas';
            }
          }
          date_data.update_date_message = update_days;
        } else {
          date_data.update_date_message = 'Sin datos de actualización';
        }
        if (req_creation_date !== null) {
          let creation_days = '';
          if (date_data.creation_date_days > 1) {
            creation_days = 'Hace ' + date_data.creation_date_days + ' dias';
          } else {
            creation_days = 'Hace ' + date_data.creation_date_days + ' dia';
            if (date_data.creation_date_days === 0) {
              creation_days = 'Hace menos de 24 horas';
            }
          }
          date_data.creation_date_message = creation_days;
        } else {
          date_data.creation_date_message = 'Sin datos de fecha de creación';
        }
      }
      return date_data;

  }

  // Novels

  getNovelsData() {
    const url = `${ this.urlnovelsdb }/api/novels`;
    console.log(url);
    return this.http.get( url );
  }

  getAllNovelsData() {
    const url = `${ this.urlnovelsdb }/api/all-novels`;
    console.log(url);
    return this.http.get( url );
  }
  getNovelData(id: string) {
    const url = `${ this.urlnovelsdb }/api/novel/${id}`;
    console.log(url);
    return this.http.get( url );
  }

  getGenres() {
    const url = `${ this.urlnovelsdb }/api/genres`;
    console.log(url);
    return this.http.get( url );
  }

  getNovelChapters(id: string) {
    const url = `${ this.urlnovelsdb }/api/novel/${id}/chapters`;
    console.log(url);
    return this.http.get( url );
  }

  getNovelsGenres(id: string) {
    const url = `${ this.urlnovelsdb }/api/novel-genres/${id}`;
    console.log(url);
    return this.http.get( url );
  }

  addGenreToNovel(jwt: string, novel_id: any, genre_id: any) {
    const genres = {
      novel_id: novel_id,
      genre_id: genre_id
    };
    console.log(genres);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/add-genre-to-novel`;
    console.log(url);
    return this.http.post(url, genres, httpOptions);
  }

  searchUserToInvite(jwt: string, user: any) {
    console.log(user);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/search-user`;
    console.log(url);
    return this.http.post(url, user, httpOptions);
  }

  sendInvitationToUser(jwt: string, invitation: any) {
    console.log(invitation);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/send-invitation-to-user`;
    console.log(url);
    return this.http.post(url, invitation, httpOptions);
  }

  adminVerification(user: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': user.jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/admin-verification`;
    return this.http.post(url, user, httpOptions);
  }

  updateUserInvitation(jwt: string, invitation: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/update-user-invitation`;
    console.log(invitation);
    return this.http.put(url , invitation, httpOptions);
  }

  showUserInvitations(jwt: string, id: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/get-user-invitations/${id}`;
    console.log(url);
    return this.http.get(url, httpOptions);
  }

  createNovelCollaborator(jwt: string, user_novel: any) {
    console.log(user_novel);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/create-novel-collaborator`;
    console.log(url);
    return this.http.post(url, user_novel, httpOptions);
  }

  cleanNovelGenres(jwt: string, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };

    const url = `${ this.urlnovelsdb }/api/clean-novel-genres/${id}`;
    return this.http.delete(url, httpOptions);
  }

  createGenre(jwt: string, genre: any) {
    console.log(genre);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/new-genre`;
    console.log(url);
    return this.http.post(url, genre, httpOptions);
  }

  updateGenre(jwt: string, genre: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/update-genre`;
    console.log(genre);
    return this.http.put(url , genre, httpOptions);
  }

  deleteGenre(jwt: string, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };

    const url = `${ this.urlnovelsdb }/api/delete-genre/${id}`;
    return this.http.delete(url, httpOptions);
  }



  getUserNovelData(jwt: string, user: User): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/novels-user`;
    console.log(user);
    return this.http.post(url, user, httpOptions);
  }

  getCollaboratorNovels(jwt: string, user: User): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/novels-collaborators`;
    console.log(user);
    return this.http.post(url, user, httpOptions);
  }

  getNovelCollaborators(jwt: string, id: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/get-novel-collaborators/${id}`;
    console.log(url);
    return this.http.get(url, httpOptions);
  }

  deleteNovelCollaborator(jwt: string, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };

    const url = `${ this.urlnovelsdb }/api/delete-novel-collaborator/${id}`;
    return this.http.delete(url, httpOptions);
  }

  newNovel(jwt: string, novel: Novel) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/new-novel`;
    console.log(url);
    return this.http.post(url, novel, httpOptions);
  }

  deleteNovelImg(jwt: string, img: string) {
    console.log(img);
    const imagen = {
      img: img
    };
    const url = `${ this.urlnovelsdb }/api/delete-novel_img`;
    console.log(url);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    return this.http.post(url, imagen, httpOptions);
  }

  updateNovel(jwt: string, novel: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/update-novel`;
    console.log(novel);
    return this.http.put(url , novel, httpOptions);
  }

  updateNovelRate(jwt: string, rate: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/update-novel`;
    console.log(rate);
    return this.http.put(url , rate, httpOptions);
  }

  getUserBoomarks(jwt: string, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };

    const url = `${ this.urlnovelsdb }/api/find-user-reading-list/${id}`;
    console.log(url);
    return this.http.get(url, httpOptions);
  }

  getNovelBoomark(jwt: string, nvl: string, uid: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };

    const url = `${ this.urlnovelsdb }/api/check-novel-bookmark/${nvl}/${uid}`;
    return this.http.get(url, httpOptions);
  }

  deleteNovelBoomark(jwt: string, nvl: string, uid: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };

    const url = `${ this.urlnovelsdb }/api/remmove-user-bookmark/${nvl}/${uid}`;
    return this.http.delete(url, httpOptions);
  }

  newUserReadingList(jwt: any, readingList: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${this.urlnovelsdb}/api/create-user-reading-list`;
    return this.http.post(url, readingList, httpOptions);
  }


  updateUserBookmark(jwt: any, bookmark: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${this.urlnovelsdb}/api/update-user-bookmark`;
    return this.http.put(url, bookmark, httpOptions);
  }

  deleteNovel(jwt: string, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/delete-novel/${id}`;
    return this.http.delete(url, httpOptions);
  }

  getNovelsRatings(id: any) {
    const httOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    const url = ` ${ this.urlnovelsdb }/api/rating-novel/${id} `;
    console.log(url);
    return this.http.get(url, httOptions);
  }

  updateNovelRating(jwt: string, chapter: Chapter, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };

    const url = `${ this.urlnovelsdb }/api/update-chapter/${id}`;
    console.log(url);

    return this.http.put(url , chapter, httpOptions);
  }



  getUserChapterData(jwt: string, id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/chapter-edit/${id}`;
    return this.http.get(url, httpOptions);
  }

  newChapter(jwt: string, chapter: Chapter) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };

    const url = `${ this.urlnovelsdb }/api/new-chapter`;
    console.log(url);

    return this.http.post(url, chapter, httpOptions);
  }

  updateChapter(jwt: string, chapter: Chapter) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };

    const url = `${ this.urlnovelsdb }/api/update-chapter/${chapter.id}`;
    console.log(url);

    return this.http.put(url , chapter, httpOptions);
  }

  deleteChapter(jwt: string, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };

    const url = `${ this.urlnovelsdb }/api/delete-chapter/${id}`;
    console.log(url);

    return this.http.delete(url, httpOptions);
  }

  searchNovels(term: string) {
    const url = `${ this.urlnovelsdb }/api/search-novels/${term}`;
    return this.http.get(url);
  }

  gethomeChaptersData() {
    const url = `${ this.urlnovelsdb }/api/chapters-by-date`;
    return this.http.get(url);
  }

  gethomeLastNovelsData() {
    const url = `${ this.urlnovelsdb }/api/home-last-novels`;
    return this.http.get(url);
  }

  postNovelRate (jwt: string, rate: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };

    const url = `${ this.urlnovelsdb }/api/create-novel-rate`;
    console.log(url);

    return this.http.post(url, rate, httpOptions);
  }

  getNovelComments (id: any) {
    const url = `${ this.urlnovelsdb }/api/novel-comments/${id}`;
    return this.http.get(url);
  }

  // Forum

  getForumData()  {
    const url = `${ this.urlnovelsdb}/api/forum-get/`;
    console.log(url);
    return this.http.get( url );
  }

  getAllPosts(jwt: string, orderBy: any, orderOption: any) {
  const orderOptions = {
    orderBy: orderBy,
    orderOption: orderOption
  };

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': jwt
    })
  };

  const url = `${this.urlnovelsdb}/api/admin-get-all-posts`;
  console.log(url);
  return this.http.post( url, orderOptions, httpOptions);
}


  getForumType(type: any) {
    const url = `${ this.urlnovelsdb}/api/posts-get/${type}`;
    console.log(url);
    return this.http.get(url);
  }

  getPost(id: string) {
    const url = `${ this.urlnovelsdb }/api/post-get/${id}`;
    console.log(url);
    return this.http.get( url );
  }

  newPost(jwt: string, post: Post) {
    const httpOptions = {
       headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/post-create`;
    console.log(url);
    return this.http.post(url, post, httpOptions);
  }

  updatePost(jwt: string, post: Post, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };

    const url = `${ this.urlnovelsdb }/api/update-post/${id}`;
    console.log(url);

    return this.http.put(url , post, httpOptions);
  }

  newComment(jwt: string, comment: PostComment) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${this.urlnovelsdb}/api/comment-create`;
    return this.http.post(url, comment, httpOptions);
  }

  getPostComments(id: string) {
    const url = `${ this.urlnovelsdb }/api/get-post-comments/${id}`;
    console.log(url);
    return this.http.get( url );
  }

  getPostComment(id: string) {
    const url = `${ this.urlnovelsdb }/api/get-comment/${id}`;
    console.log(url);
    return this.http.get( url );
  }

  updatePostComment (jwt: string, post_comment: PostComment) {
    console.log(post_comment);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };

    const url = `${this.urlnovelsdb}/api/update-comment`;
    return this.http.put(url , post_comment, httpOptions);
  }

  deletePost(jwt: string, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${this.urlnovelsdb}/api/delete-post/${id}`;
    return this.http.delete(url , httpOptions);
  }

  deleteComment (jwt: string, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${this.urlnovelsdb}/api/delete-comment/${id}`;
    return this.http.delete(url , httpOptions);
  }

  //  ******************************
  //  *********Admin Panel**********
  //  ******************************

  //   forum -------------------------

  deleteforumCategory (jwt: string, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${this.urlnovelsdb}/api/delete-forum-category/${id}`;
    return this.http.delete(url , httpOptions);
  }

  newforumCategory(jwt: string, category: any) {
    const httpOptions = {
       headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/forum-create`;
    console.log(url);
    return this.http.post(url, category, httpOptions);
  }

  updateforumCategory(jwt: string, category: any) {
    const object = {
      id: category.id,
      forum_type: category.forum_type,
      forum_category_description: category.forum_category_description
    };
    console.log(object);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };

    const url = `${ this.urlnovelsdb }/api/forum-update`;
    console.log(url);

    return this.http.put(url, object, httpOptions);
  }

  //

  //  ******************************
  //  ******************************
  //  ******************************

    // Users

  getUsers(jwt: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb}/api/users`;
    console.log(url);
    return this.http.get(url, httpOptions);
  }

  getEmailVerification(key: string) {
    const url = `${ this.urlnovelsdb}/api/user/email-verification/${key}`;
    console.log(url);
    return this.http.get(url);
  }

  getPasswordResetUser(jwt: string) {
    const url = `${ this.urlnovelsdb}/api/user/get-user-by-email-token/${jwt}`;
    console.log(url);
    return this.http.get(url);
  }

  getPasswordResetRequest(email: string) {
    const url = `${ this.urlnovelsdb}/api/user/password-reset`;
    console.log(url);
    return this.http.post(url, email);
  }

  updatePassword(user: UpdatePass, jwt: string) {
    console.log(user);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${ this.urlnovelsdb }/api/update-user-password`;
    console.log(url);
    return this.http.put(url, user, httpOptions);
  }

  updateUserData(jwt: string, userData: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${this.urlnovelsdb}/api/update-user`;
    return this.http.put(url, userData, httpOptions);
  }

  adminUpdateUserData(jwt: string, userData: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };
    const url = `${this.urlnovelsdb}/api/admin-update-user`;
    return this.http.put(url, userData, httpOptions);
  }

  deleteUser(jwt: string, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': jwt
      })
    };

    const url = `${ this.urlnovelsdb }/api/delete-user/${id}`;
    return this.http.delete(url, httpOptions);
  }

  // Upload images to BackEnd

  uploadImage(id: any, jwt: string, file: File, img: string, imageType: string) {
    let url: string;
    let appendType: string;
    let oldAppendType: string;
    if (imageType === 'novel') {
      url = `${ this.urlnovelsdb }/api/upload-novel-img/${id}`;
      appendType = 'novel_image';
      oldAppendType = 'old_novel_image';
    }
    if (imageType === 'user') {
      url = `${ this.urlnovelsdb }/api/upload-profile-img/${id}`;
      appendType = 'user_profile_image';
      oldAppendType = 'old_user_profile_image';
    }
    if (imageType !== 'user' && imageType !== 'novel') {
      console.log('Cancelando subida de archivo');
      return;
    }
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();
      formData.append(appendType, file, file.name);
      if (img || img !== undefined ||  img !== null || img.length > 0 || img !== '') {
        formData.append(oldAppendType, img);
      }
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', jwt);
      xhr.send(formData);

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            return resolve(JSON.parse(xhr.response));
          } else {
            return reject(JSON.parse(xhr.response));
          }
        }
      };
    });
  }
}
