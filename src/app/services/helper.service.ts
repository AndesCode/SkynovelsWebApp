import { Injectable, EventEmitter  } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  invokeExternalFunction = new EventEmitter();
  sendCurrentComponnent = new EventEmitter();

  private urlnovelsdb: string;
  constructor() {
    this.urlnovelsdb = '/api';
  }

  openExternalFunction(functionCalled: string) {
    this.invokeExternalFunction.emit(functionCalled);
  }

  getCurrentComponent(component: any) {
    this.sendCurrentComponnent.emit(component);
  }

  getRelativeTime(date: Date, update?: boolean, format?: string) {
    if (date === null || date === undefined || Object.prototype.toString.call(date) === '[object Date]') {
      const date_data_empty =  {
        seconds: 0,
        message: 'Sin datos'
      };
      return date_data_empty;
    }
    const today = new Date();
    const creation_time = new Date(date);
    const creation_time_diff = Math.abs(today.getTime() - (creation_time.getTime() - 3600000));
    const date_diffSeconds = Math.ceil(((creation_time_diff) / 1000));
    moment.locale('es');
    if (update && format !== 'short') {
      moment.updateLocale('es', {
        relativeTime : {
            past:   'Actualizado hace %s',
            s : 'unos segundos',
            m : 'un minuto',
            mm : '%d minutos',
            h : 'una hora',
            hh : '%d horas',
            d : 'un día',
            dd : '%d días',
            M : 'un mes',
            MM : '%d meses',
            y : 'un año',
            yy : '%d años'
        }
      });
    } else {
      moment.updateLocale('es', {
        relativeTime : {
            past:   'Hace %s',
            s : 'unos segundos',
            m : 'un minuto',
            mm : '%d minutos',
            h : 'una hora',
            hh : '%d horas',
            d : 'un día',
            dd : '%d días',
            M : 'un mes',
            MM : '%d meses',
            y : 'un año',
            yy : '%d años'
        }
      });
    }
    if (format && format === 'short') {
      moment.updateLocale('es', {
        relativeTime : {
            past:   '%s',
            s : '1m',
            m : '%dm',
            mm : '%dm',
            h : '%dh',
            hh : '%dh',
            d : '%dd',
            dd : '%dd',
            M : '%dM',
            MM : '%dM',
            y : '%da',
            yy : '%da'
        }
      });
    }
    let sknmoment: any = moment(date);
    sknmoment = moment((sknmoment).fromNow());
    const date_data =  {
      seconds: date_diffSeconds,
      message: sknmoment._i
    };
    return date_data;
  }

  // Data Sorters
  lastDateSorter(a, b) {
    return new Date (b.createdAt).getTime() - new Date (a.createdAt).getTime();
  }

  mostPopularNovelSorter(a, b) {
        return  (b.nvl_rating) - (a.nvl_rating);
  }

  chpNumberSorter(a, b) {
    return  (a.chp_number) - (b.chp_number);
  }

  forumAcitivitySorter(a, b) {
    return  (a.date_data.seconds) - (b.date_data.seconds);
  }

  dateDataSorter(a, b) {
    return  (a.date_data.seconds) - (b.date_data.seconds);
  }

  dateDataSorterReversed(a, b) {
    return  (b.date_data.seconds) - (a.date_data.seconds);
  }

  pinnedForumPostDataSorter(a, b) {
    if (a.post_pinned === true) { return -1; }
  }

  lastUpdatedSorter(a, b) {
    return b.updatedAt - a.updatedAt;
  }

  novelRatingAvarageCalculator(ratings: Array<any>) {
    let rating = 0;
    for (let i = 0; i < ratings.length; i++) {
      rating += ratings[i].rate_value;
      if (i === ratings.length - 1) {
        rating /= ratings.length;
      }
    }
    return rating;
  }

  setContent(content: string, length: number) {
    return content.length > length ? (content).substring(0, length) + '...' : content;
  }

    // Upload images to BackEnd

    uploadImage(id: any, file: File, img: string, imageType: 'novel' | 'user') {
      let url: string;
      let appendType: string;
      let oldAppendType: string;
      if (imageType === 'novel') {
        url = `${ this.urlnovelsdb }/upload-novel-img/${id}`;
        appendType = 'novel_image';
        oldAppendType = 'old_novel_image';
      }
      if (imageType === 'user') {
        url = `${ this.urlnovelsdb }/upload-user-profile-img/${id}`;
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
        xhr.withCredentials = true;
        xhr.open('POST', url, true);
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
    getRandomNumer(min: number, max: number) {
      return Math.round(Math.floor(Math.random() * (max - min))) + min;
    }
}
