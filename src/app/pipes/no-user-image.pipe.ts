import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noUserImage'
})
export class NoUserImagePipe implements PipeTransform {

  transform(userProfileImage: string) {
    if (userProfileImage && userProfileImage.length > 0) {
      return 'http://localhost:3000/api/user-profile-img/' + userProfileImage + '/false';
    } else {
      return '../../../assets/img/noimage.jpg';
    }
  }
}
