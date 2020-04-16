import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'novelFilter'
})
export class NovelFilterPipe implements PipeTransform {

  transform(novels: any, novelTitle: any, novelGenres: any): any {
    const resultNovels = [];
    if (novels) {
      for (const novel of novels) {
        if (novelGenres.length > 0) {
          const novelAssignedGenres = novel.genres.map(genre => genre.id);
          const found = novelGenres.some(r => novelAssignedGenres.indexOf(r) >= 0);
          if (found && novel.nvl_title.toLowerCase().indexOf(novelTitle.toLowerCase()) > -1) {
            resultNovels.push(novel);
          }
        } else {
          if (novel.nvl_title.toLowerCase().indexOf(novelTitle.toLowerCase()) > -1) {
            resultNovels.push(novel);
          }
        }
      }
      return resultNovels;
    }
  }
}
