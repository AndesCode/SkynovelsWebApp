import { isDevMode, Pipe, PipeTransform } from '@angular/core';
import { Dev, Prod } from '../config/config';

@Pipe({
  name: 'noUserImage'
})
export class NoUserImagePipe implements PipeTransform {

  apiURL: string

  constructor(private dev: Dev, private prod: Prod) {
    if (isDevMode()) {
      this.apiURL = this.dev.apiURL
    } else {
      this.apiURL = this.prod.apiURL
    }
  }

  transform(userProfileImage: string) {
    if (userProfileImage && userProfileImage.length > 0) {
      return this.apiURL + '/api/get-image/' + userProfileImage + '/users/false';
    } else {
      return '../../../assets/img/usernoimage.jpg';

    }
  }
}
