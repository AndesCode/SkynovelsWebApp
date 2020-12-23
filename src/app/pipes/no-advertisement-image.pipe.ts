import { isDevMode, Pipe, PipeTransform } from '@angular/core';
import { Dev, Prod } from '../config/config';

@Pipe({
  name: 'noAdvertisementImage'
})
export class NoAdvertisementImagePipe implements PipeTransform {

  apiURL: string

  constructor(private dev: Dev, private prod: Prod) {
    if (isDevMode()) {
      this.apiURL = this.dev.apiURL
    } else {
      this.apiURL = this.prod.apiURL
    }
  }

  transform(advImg: string) {
    if (advImg && advImg.length > 0) {
      return this.apiURL + '/api/get-image/' + advImg + '/advertisements/false'
    } else {
      return '../../../assets/img/noimage.jpg';
    }
  }
}
