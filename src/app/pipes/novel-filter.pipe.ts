import { Pipe, PipeTransform } from '@angular/core';
import { Novel } from '../models/models';

@Pipe({
  name: 'novelFilter'
})
export class NovelFilterPipe implements PipeTransform {

  transform(novels: Array<any>,
            novelTitle: string,
            novelGenres: Array<any>,
            searchStatus: 'All' | 'Activa' | 'Inactiva' | 'Finalizada'): any {
    const resultNovels = [];
    if (novels) {
      for (const novel of novels) {
        if (novelGenres.length > 0) {
          const novelAssignedGenres = novel.genres.map(genre => genre.id);
          const found = novelGenres.some(r => novelAssignedGenres.indexOf(r) >= 0);
          if (found && novel.nvl_title.toLowerCase().indexOf(novelTitle.toLowerCase()) > -1 &&
          (searchStatus === 'All' || novel.nvl_status === searchStatus)) {
            resultNovels.push(novel);
          }
        } else {
          if (novel.nvl_title.toLowerCase().indexOf(novelTitle.toLowerCase()) > -1 &&
          (searchStatus === 'All' || novel.nvl_status === searchStatus)) {
            resultNovels.push(novel);
          }
        }
      }
      return resultNovels;
    }
  }
}
