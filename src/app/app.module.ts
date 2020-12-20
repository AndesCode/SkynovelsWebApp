// Angular essential
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { Dev, Prod } from './config/config';
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CdkOverlayContainer } from './cdk-overlay-container-extension';
import { getSpanishPaginatorIntl } from './spanish-paginator-intl';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
// Components
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbars/navbar/navbar.component';
import { NovelsComponent } from './components/novels/novels.component';
import { NovelCardComponent } from './components/cards/novel-card/novel-card.component';
import { NovelComponent } from './components/novel/novel.component';
import { UserNovelsComponent } from './components/user-novels/user-novels.component';
import { UserNovelComponent } from './components/user-novel/user-novel.component';
/*import { ForumComponent } from './components/forum/forum.component';
import { ForumCategoryComponent } from './components/forum/forum-category/forum-category.component';
import { ForumPostComponent } from './components/forum/forum-category/forum-post/forum-post.component';
import { ForumManagementComponent } from './components/admin-panel/forum-management/forum-management.component';*/
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ChaptersComponent } from './components/chapters/chapters.component';
import { UserChapterComponent } from './components/user-novel/user-chapter/user-chapter.component';
import { FooterComponent } from './components/footer/footer.component';
import { InvitationsComponent } from './components/invitations/invitations.component';
import { MobileNavbarComponent } from './components/navbars/mobile-navbar/mobile-navbar.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { UsersManagementComponent } from './components/admin-panel/users-management/users-management.component';
import { UserManagementComponent } from './components/admin-panel/users-management/user-management/user-management.component';
import { NovelsManagementComponent } from './components/admin-panel/novels-management/novels-management.component';
import { HomeManagementComponent } from './components/admin-panel/home-management/home-management.component';
import { NovelManagementComponent } from './components/admin-panel/novels-management/novel-management/novel-management.component';
import { ChapterManagementComponent } from './components/admin-panel/novels-management/novel-management/chapter-management/chapter-management.component';
import { AdvertisementManagementComponent } from './components/admin-panel/home-management/advertisement-management/advertisement-management.component';
import { AdvertisementComponent } from './components/advertisement/advertisement.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { UserActivationComponent } from './components/user-activation/user-activation.component';
// bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Pipes
import { NoUserImagePipe } from './pipes/no-user-image.pipe';
import { NoimagePipe } from './pipes/noimage.pipe';
import { NovelFilterPipe } from './pipes/novel-filter.pipe';
import { NoAdvertisementImagePipe} from './pipes/no-advertisement-image.pipe';
// Installations
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule, SWIPER_CONFIG, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InViewportModule } from 'ng-in-viewport';
import { AdsenseModule } from 'ng2-adsense';
import { LoadingErrorComponent } from './components/loading-error/loading-error.component';


import { MarkdownModule } from 'ngx-markdown';

const config: SwiperConfigInterface = {
  direction: 'horizontal',
  observer: true,
  slidesPerView: 1,
  keyboard: true,
  mousewheel: true,
  scrollbar: false,
  navigation: true,
  pagination: false
};

@NgModule({
  declarations: [
    // components
    NovelComponent,
    AppComponent,
    HomeComponent,
    NavbarComponent,
    NovelsComponent,
    NovelCardComponent,
    MobileNavbarComponent,
    AdminPanelComponent,
    UsersManagementComponent,
    UserNovelsComponent,
    UserNovelComponent,
    BookmarksComponent,
    // Forum
    /*ForumComponent,
    ForumCategoryComponent,
    ForumPostComponent,
    ForumManagementComponent,*/
    UserProfileComponent,
    ChaptersComponent,
    UserChapterComponent,
    FooterComponent,
    InvitationsComponent,
    UserManagementComponent,
    NovelsManagementComponent,
    HomeManagementComponent,
    NovelManagementComponent,
    ChapterManagementComponent,
    AdvertisementManagementComponent,
    AdvertisementComponent,
    PasswordRecoveryComponent,
    UserActivationComponent,
    // pipes
    NoimagePipe,
    NoAdvertisementImagePipe,
    NoUserImagePipe,
    NovelFilterPipe,
    LoadingErrorComponent,
  ],
  imports: [
    MarkdownModule.forRoot(),
    // Angular
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    TransferHttpCacheModule,
    OverlayModule,
    // Material
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSortModule,
    MatGridListModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatMenuModule,
    MatTreeModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatTableModule,
    // bootstrap
    NgbModule,
    // Installations
    CKEditorModule,
    NgxPaginationModule,
    SwiperModule,
    Ng2SearchPipeModule,
    InfiniteScrollModule,
    InViewportModule,
    AdsenseModule.forRoot({
      adClient: 'ca-pub-7640562161899788',
      adSlot: 7259870550,
    }),
  ],
  providers: [
    { provide: OverlayContainer, useClass: CdkOverlayContainer },
    {
      provide: SWIPER_CONFIG,
      useValue: config
    },
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    { provide: 'googleTagManagerId', useValue: 'GTM-M74RWWL' },
    Prod,
    Dev,
    NoimagePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
