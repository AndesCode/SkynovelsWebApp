import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noimage'
})
export class NoimagePipe implements PipeTransform {

  transform(nvlImg: string) {
    if (nvlImg && nvlImg.length > 0) {
      return 'http://localhost:3000/api/novel/image/' + nvlImg + '/false';
    } else {
      return '../../../assets/img/noimage.jpg';
    }
  }
}
