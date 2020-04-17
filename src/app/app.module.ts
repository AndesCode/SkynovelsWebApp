// Angular essential
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSelectModule } from '@angular/material/select';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CdkOverlayContainer } from './cdk-overlay-container-extension';
import { CdkOverlayDirective } from './cdk-overlay.directive';
// Components
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbars/navbar/navbar.component';
import { NovelsComponent } from './components/novels/novels.component';
import { NovelCardComponent } from './components/cards/novel-card/novel-card.component';
import { NovelComponent } from './components/novel/novel.component';
import { UserNovelsComponent } from './components/user-novels/user-novels.component';
import { UserNovelComponent } from './components/user-novel/user-novel.component';
import { ForumComponent } from './components/forum/forum.component';
import { ForumCategoryComponent } from './components/forum/forum-category/forum-category.component';
import { ForumPostComponent } from './components/forum/forum-category/forum-post/forum-post.component';
import { ForumManagementComponent } from './components/admin-panel/forum-management/forum-management.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ChaptersComponent } from './components/chapters/chapters.component';
// bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Pipes
import { NoUserImagePipe } from './pipes/no-user-image.pipe';
import { NoimagePipe } from './pipes/noimage.pipe';
import { NoimagePipeThumb } from './pipes/noimagethumb.pipe';
import { NovelFilterPipe } from './pipes/novel-filter.pipe';
import { LoginComponent } from './components/login/login.component';
import { MobileNavbarComponent } from './components/navbars/mobile-navbar/mobile-navbar.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { UserManagementComponent } from './components/admin-panel/user-management/user-management.component';
// Installations
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule, SWIPER_CONFIG, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InViewportModule } from 'ng-in-viewport';
// Test Eliminar
import { TestComponent } from './components/test/test.component';



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
    LoginComponent,
    MobileNavbarComponent,
    AdminPanelComponent,
    UserManagementComponent,
    UserNovelsComponent,
    UserNovelComponent,
    // pipes
    NoimagePipeThumb,
    NoimagePipe,
    NoUserImagePipe,
    NovelFilterPipe,
    ForumComponent,
    ForumCategoryComponent,
    ForumPostComponent,
    ForumManagementComponent,
    UserProfileComponent,
    TestComponent,
    ChaptersComponent,
    CdkOverlayDirective
  ],
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
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
    // bootstrap
    NgbModule,
    // Installations
    CKEditorModule,
    NgxPaginationModule,
    SwiperModule,
    Ng2SearchPipeModule,
    InfiniteScrollModule,
    InViewportModule
  ],
  providers: [
    { provide: OverlayContainer, useClass: CdkOverlayContainer },
    {
    provide: SWIPER_CONFIG,
    useValue: config
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
