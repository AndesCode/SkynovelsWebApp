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

  // Data Sorters
  lastDateSorter (a, b) {
    return new Date (b.createdAt).getTime() - new Date (a.createdAt).getTime();
  }

  mostPopularNovelSorter (a, b) {
        return  (b.nvl_rating) - (a.nvl_rating);
  }

  chpNumberSorter (a, b) {
    return  (a.chp_number) - (b.chp_number);
  }

  forumAcitivitySorter (a, b) {
    return  (a.date_data.seconds) - (b.date_data.seconds);
  }

  dateDataSorter (a, b) {
    return  (a.date_data.seconds) - (b.date_data.seconds);
  }

  dateDataSorterReversed (a, b) {
    return  (b.date_data.seconds) - (a.date_data.seconds);
  }

  pinnedForumPostDataSorter (a, b) {
    if (a.post_pinned === true) { return -1; }
  }

  lastUpdatedSorter  (a, b) {
    // TODO: EVALUAR QUE LOS DATOS SEAN NULL
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

    uploadImage(id: any, file: File, img: string, imageType: string) {
      let url: string;
      let appendType: string;
      let oldAppendType: string;
      if (imageType === 'novel') {
        url = `${ this.urlnovelsdb }/upload-novel-img/${id}`;
        appendType = 'novel_image';
        oldAppendType = 'old_novel_image';
      }
      if (imageType === 'user') {
        url = `${ this.urlnovelsdb }/upload-profile-img/${id}`;
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
    /**
     * Esta funcion devuelve un numero Entero que se este dentro de los limites asignados por parametros
     * @param min Valor minimo de la busqueda(Este valor se incluye)
     * @param max Valor maximo de la busqueda (Este valor se excluye)
     * 
     * 
     */
    getRandomNumer(min: number, max: number) {
      return Math.round(Math.floor(Math.random() * (max - min))) + min;
    }
}
