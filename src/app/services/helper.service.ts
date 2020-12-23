import { Injectable, EventEmitter, isDevMode  } from '@angular/core';
import * as moment from 'moment';
import { Dev, Prod } from '../config/config';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  invokeExternalFunction = new EventEmitter();
  sendCurrentComponnent = new EventEmitter();

  private urlCredentialsNovelsDb: string;
  constructor(private dev: Dev,
              private prod: Prod,
              private meta: Meta,
              private title: Title) {
                if (isDevMode()) {
                  this.urlCredentialsNovelsDb = this.dev.urlCredentialsNovelsDb;
                } else {
                  this.urlCredentialsNovelsDb = this.prod.urlCredentialsNovelsDb;
                }
  }


  openExternalFunction(functionCalled: string) {
    this.invokeExternalFunction.emit(functionCalled);
  }

  getCurrentComponent(component: any) {
    this.sendCurrentComponnent.emit(component);
  }

  getCurrentYear() {
    return moment().year();
  }

  updateBrowserMeta(nameString: string, contentString: string, title?: string) {
    if (title) {
      this.title.setTitle(title);
    }
    this.meta.updateTag({name: nameString, content: contentString});
  }

  getRelativeTime(date: Date, update?: boolean, format?: string) {
    if (date === null || date === undefined || Object.prototype.toString.call(date) === '[object Date]') {
      const dateDataEmpty =  {
        seconds: 0,
        message: 'Sin datos'
      };
      return dateDataEmpty;
    }
    const today = new Date();
    const creationTime = new Date(date);
    const creationTimeDiff = Math.abs(today.getTime() - (creationTime.getTime() - 3600000));
    const dateDiffSeconds = Math.ceil(((creationTimeDiff) / 1000));
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
    const dateData =  {
      seconds: dateDiffSeconds,
      message: sknmoment._i
    };
    return dateData;
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

  /*nvlTitleSorter(a, b){
    if (a.nvl_title < b.nvl_title) { return -1; }
    if (a.nvl_title > b.nvl_title) { return 1; }
    return 0;
  }*/


  sorterAsc(prop) {
    if (prop === 'date_data') {
      return (a, b) => {
        return b.date_data.seconds - a.date_data.seconds;
      };
    } else {
      return (a, b) => {
        if (isNaN(a[prop])) {
          if (a[prop] < b[prop]) { return -1; }
          if (a[prop] > b[prop]) { return 1; }
          return 0;
        } else {
          return a[prop] - b[prop];
        }
      };
    }
  }

  sorterDesc(prop) {
    if (prop === 'date_data') {
      return (a, b) => {
        return a.date_data.seconds - b.date_data.seconds;
      };
    } else {
      return (a, b) => {
        if (isNaN(a[prop])) {
          if (b[prop] < a[prop]) { return 1; }
          if (b[prop] > a[prop]) { return -1; }
          return 0;
        } else {
          return b[prop] - a[prop];
        }
      };
    }
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
    return Number(rating.toFixed(1));
  }

  closeMatExpansionPanel(object: any) {
    setTimeout(() => {
      object.open = false;
    }, 500);
  }

  uploadImage(id: any, file: File, imageType: 'novel' | 'user') {
    let url: string;
    if (imageType === 'novel') {
      url = `${ this.urlCredentialsNovelsDb }/upload-novel-img/${id}`;
    }
    if (imageType === 'user') {
      url = `${ this.urlCredentialsNovelsDb }/upload-user-profile-img/${id}`;
    }
    if (imageType !== 'user' && imageType !== 'novel') {
      return;
    }
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();
      formData.append('image', file, file.name);
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
}
