import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noimagethumb'
})
export class NoimagePipeThumb implements PipeTransform {

  transform(nvl_img: any): string {
    if (!nvl_img || nvl_img === '' || nvl_img.length <= 0) {
      return '../../../assets/img/noimage.jpg';
    }
    if (nvl_img.length > 0) {
      return 'http://localhost:3000/api/novel/image/' + nvl_img + '/true';
    } else {
      return '../../../assets/img/noimage.jpg';
    }
  }
}
