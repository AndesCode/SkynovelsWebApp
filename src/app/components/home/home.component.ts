import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SwiperConfigInterface} from 'ngx-swiper-wrapper';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { NovelsService } from '../../services/novels.service';
import { HelperService } from '../../services/helper.service';
import { UsersService } from 'src/app/services/users.service';
import { Advertisement, Novel } from '../../models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public swiperMobileConfig: SwiperConfigInterface = {
    spaceBetween: 10,
    observer: true,
    autoHeight: false,
    grabCursor: true,
    slidesPerView: 2,
    centeredSlides: true,
    pagination: {
      clickable: true
    }
  };

  public swiperTopConfig: SwiperConfigInterface = {
    observer: true,
    spaceBetween: 0,
    mousewheel: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

};

  public swiperHomeConfig: SwiperConfigInterface = {
    spaceBetween: 12,
    observer: true,
    slidesPerView: 1,
    loop: true,
    roundLengths: true,
    centeredSlides: true,
    initialSlide: 0,
    mousewheel: false
  };

  recentNovels: Array<Novel>;
  advertisements: Array<Advertisement>;
  topNovels: Array<Novel>;
  recomendedNovel: Novel;
  updatedNovels: Array<Novel>;
  mobile: boolean;
  swiperConfigured = false;
  loading = true;

  constructor(
    public ns: NovelsService,
    public router: Router,
    public breakpointObserver: BreakpointObserver,
    public hs: HelperService,
    public us: UsersService
  ) {}

  ngOnInit() {
    this.breakpointObserver
    .observe('(max-width: 1151px)')
    .subscribe((state: BreakpointState) => {
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
            console.log(this.updatedNovels);
          });
        }
        if (this.mobile) {
          this.mobile = true;
          setTimeout(() => {
            this.setSwiperSlidesPerView(3);
          }, 200);
          console.log(this.mobile);
        } else {
          this.mobile = false;
          setTimeout(() => {
            this.setSwiperSlidesPerView(5);
          }, 100);
        }
        this.loading = false;
    });

    this.ns.getAdvertisements().subscribe((data: any) => {
      this.advertisements = data.advertisements;
      console.log(this.advertisements);
    });
  }

  goToNovel(id: number, nvlName: string) {
    this.router.navigate(['/novelas', id, nvlName]);
  }

  goToChapter(nid: number, nvlName: string, cid: number, chpName: string) {
    this.router.navigate(['/novelas', nid, nvlName, cid, chpName]);
  }

  setSwiperSlidesPerView(slides: number) {
    console.log(this.swiperTopConfig);
    this.swiperTopConfig.slidesPerView = slides;
    this.swiperConfigured = true;
  }
}
