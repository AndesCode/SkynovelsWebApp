import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface} from 'ngx-swiper-wrapper';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { NovelsService } from '../../services/novels.service';
import { HelperService } from '../../services/helper.service';
import { Advertisement, Novel } from '../../models/models';
import { PageService } from '../../services/page.service';
import { Block1, Block2, Block3, Block4, Block5 } from 'src/app/config/yieldlove';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public swiperHomeConfig: SwiperConfigInterface = {
    spaceBetween: 12,
    observer: true,
    slidesPerView: 1,
    loop: true,
    roundLengths: true,
    centeredSlides: true,
    initialSlide: 0,
    mousewheel: false,
    autoplay: {
      delay: 6000,
      disableOnInteraction: true,
    },
  };

  public swiperTopConfig: SwiperConfigInterface = {
    observer: true,
    spaceBetween: 0,
    mousewheel: false,

  };
  // yieldlove blocks
  block1Desktop: string;
  block1Mobile: string;
  block1Div: string;
  block2Desktop: string;
  block2Mobile: string;
  block2Div: string;
  block3Desktop: string;
  block3Mobile: string;
  block3Div: string;
  block4Desktop: string;
  block4Mobile: string;
  block4Div: string;
  block5Desktop: string;
  block5Mobile: string;
  block5Div: string;
  // end yieldlove blocks

  recentNovels: Array<Novel>;
  advertisements: Array<Advertisement>;
  topNovels: Array<Novel>;
  recomendedNovel: Novel;
  updatedNovels: Array<Novel>;
  mobile: boolean;
  swiperConfigured = false;
  loading = true;
  loadingError = false;
  componentName = 'HomeComponent';
  novelChaptersForWeeks = 0;
  loadingCompleted: boolean;

  constructor(
    private ns: NovelsService,
    private breakpointObserver: BreakpointObserver,
    public hs: HelperService,
    public ps: PageService,
    private block1: Block1,
    private block2: Block2,
    private block3: Block3,
    private block4: Block4,
    private block5: Block5
  ) {
    this.block1Desktop = block1.scriptDesktop
    this.block1Mobile = block1.scriptMobile
    this.block1Div = block1.divScript
    this.block2Desktop = block2.scriptDesktop
    this.block2Div = block2.divScript
  }

  ngOnInit() {
    this.hs.updateBrowserMeta('description', 'Skynovels, el catálogo más extenso y completo de novelas web en español, con traducciones literarias originales. Disfruta de los títulos más destacados como Against The Gods (ATG), Tales of Demons and Gods (TDG) o A Will Eternal (AWE). Con las mejores traducciones de la web.', 'SkyNovels | ¡Asciende a Mundos Increíbles!');
    this.breakpointObserver.observe('(max-width: 1151px)').subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.mobile = true;
      } else {
        this.mobile = false;
      }
      if (this.swiperConfigured) {
        if (this.mobile) {
          this.setSwiperSlidesPerView(3);
        } else {
          this.setSwiperSlidesPerView(5);
        }
      }
    });
    this.ns.getHome().subscribe((data: any) => {
        this.topNovels = data.topNovels;
        this.recentNovels = data.recentNovels;
        this.recomendedNovel = data.recommendedNovel[0];
        if (this.recomendedNovel) {
          this.recomendedNovel.date_data = this.hs.getRelativeTime(this.recomendedNovel.nvl_last_update);
          if (this.recomendedNovel.nvl_status === 'Finished') {
            this.recomendedNovel.nvl_status = 'Finalizada';
          } else {
            if (this.recomendedNovel.date_data.seconds > 1296000) {
              this.recomendedNovel.nvl_status = 'Inactiva';
            } else {
              this.recomendedNovel.nvl_status = 'Activa';
            }
          }
        }
        this.updatedNovels = data.updatedNovels;
        for (const updatedNovel of this.updatedNovels) {
          updatedNovel.date_data = this.hs.getRelativeTime(updatedNovel.nvl_last_update);
          this.ns.getHomeUpdatedNovelChapters(updatedNovel.id).subscribe((updatedChapters: any) => {
            updatedNovel.chapters = updatedChapters.updatedChapters;
            for (const chapter of updatedNovel.chapters) {
              chapter.date_data = this.hs.getRelativeTime(chapter.createdAt);
              if (chapter.date_data.seconds > 1296000) {
                chapter.new = false;
              } else {
                chapter.new = true;
              }
            }
          });
        }
        if (this.mobile) {
          setTimeout(() => {
            this.setSwiperSlidesPerView(3);
          }, 200);
        } else {
          setTimeout(() => {
            this.setSwiperSlidesPerView(5);
          }, 100);
        }
        this.loading = false;
    }, error => {
      this.loadingError = true;
    });

    this.ps.getAdvertisements().subscribe((data: any) => {
      this.advertisements = data.advertisements;
    });
    this.loadingCompleted = true;
  }

  setSwiperSlidesPerView(slides: number) {
    this.swiperTopConfig.slidesPerView = slides;
    this.swiperConfigured = true;
  }
}
