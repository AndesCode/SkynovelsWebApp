import { isDevMode, Pipe, PipeTransform } from '@angular/core';
import { Dev, Prod } from '../config/config';

@Pipe({
  name: 'noimage'
})
export class NoimagePipe implements PipeTransform {

  apiURL: string

  constructor(private dev: Dev, private prod: Prod) {
    if (isDevMode()) {
      this.apiURL = this.dev.apiURL
    } else {
      this.apiURL = this.prod.apiURL
    }
    
  }

  transform(nvlImg: string) {
    if (nvlImg && nvlImg.length > 0) {
      return this.apiURL + '/api/get-image/' + nvlImg + '/novels/false';
    } else {
      return '../../../assets/img/noimage.jpg';
    }
  }
}
