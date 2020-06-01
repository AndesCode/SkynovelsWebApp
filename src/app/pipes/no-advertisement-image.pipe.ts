import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noAdvertisementImage'
})
export class NoAdvertisementImagePipe implements PipeTransform {

  transform(advImg: string) {
    if (advImg && advImg.length > 0) {
      return 'http://localhost:3000/api/advertisement/image/' + advImg;
    } else {
      return '../../../assets/img/noimage.jpg';
    }
  }
}
