import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noUserImage'
})
export class NoUserImagePipe implements PipeTransform {

  transform(user_profile_image: any): string {
    if (!user_profile_image || user_profile_image === '' || user_profile_image.length <= 0) {
      return '../../../assets/img/noimage.jpg';
    }
    if (user_profile_image.length > 0) {
      return 'http://localhost:3000/api/user/image/' + user_profile_image + '/false';
    } else {
      return '../../../assets/img/noimage.jpg';
    }
  }
}
