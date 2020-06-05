
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardService } from './services/guard.service';
import { HomeComponent } from './components/home/home.component';
import { NovelsComponent } from './components/novels/novels.component';
import { NovelComponent } from './components/novel/novel.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { UsersManagementComponent } from './components/admin-panel/users-management/users-management.component';
import { UserManagementComponent } from './components/admin-panel/users-management/user-management/user-management.component';
import { ForumManagementComponent } from './components/admin-panel/forum-management/forum-management.component';
import { UserNovelsComponent } from './components/user-novels/user-novels.component';
import { UserNovelComponent } from './components/user-novel/user-novel.component';
import { ForumComponent } from './components/forum/forum.component';
import { ForumCategoryComponent } from './components/forum/forum-category/forum-category.component';
import { ForumPostComponent } from './components/forum/forum-category/forum-post/forum-post.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ChaptersComponent } from './components/chapters/chapters.component';
import { UserChapterComponent } from './components/user-novel/user-chapter/user-chapter.component';
import { InvitationsComponent } from './components/invitations/invitations.component';
import { NovelsManagementComponent } from './components/admin-panel/novels-management/novels-management.component';
import { HomeManagementComponent } from './components/admin-panel/home-management/home-management.component';
import { NovelManagementComponent } from './components/admin-panel/novels-management/novel-management/novel-management.component';
import { ChapterManagementComponent } from './components/admin-panel/novels-management/novel-management/chapter-management/chapter-management.component';
import { AdvertisementManagementComponent } from './components/admin-panel/home-management/advertisement-management/advertisement-management.component';
import { AdvertisementComponent } from './components/advertisement/advertisement.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
// Test
import { TestComponent } from './components/test/test.component';


/*
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LoginComponent } from './components/login/login.component';
import { MyNovelComponent } from './components/my-novel/my-novel.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { NewPasswordFormComponent } from './components/new-password-form/new-password-form.component';
import { AnalyticsComponent } from './components/admin-panel/analytics/analytics.component';
import { ForumManagementComponent } from './components/admin-panel/forum-management/forum-management.component';
import { NovelManagementComponent } from './components/admin-panel/novel-management/novel-management.component';
import { NovelAdminEditionComponent } from './components/admin-panel/novel-management/novel-admin-edition/novel-admin-edition.component';
import { InvitationsComponent } from './components/invitations/invitations.component';
import { DevStylesTestComponent } from './components/dev-styles-test/dev-styles-test.component';
import { ForumCategoryComponent } from './components/forum/forum-category/forum-category.component';
import { ForumPostComponent } from './components/forum/forum-category/forum-post/forum-post.component';*/


const routes: Routes = [
  // home
  { path: '', component: HomeComponent },
  // novels
  { path: 'novelas', component: NovelsComponent },
  { path: 'novelas/:nid', component: NovelComponent },
  { path: 'novelas/:nid/:ntitle', component: NovelComponent },
  { path: 'novelas/:nid/:ntitle/:cid', component: ChaptersComponent },
  { path: 'novelas/:nid/:ntitle/:cid/:ctitle', component: ChaptersComponent },
    // admin panel
  {
    path: 'panel',
    component: AdminPanelComponent,
    canActivate: [GuardService],
    children: [
      {path: 'administracion-de-usuarios', component: UsersManagementComponent},
      {path: 'administracion-de-usuarios/:id', component: UserManagementComponent},
      {path: 'administracion-del-foro', component: ForumManagementComponent},
      {path: 'administracion-del-foro/:id', component: ForumManagementComponent},
      {path: 'administracion-de-pagina-de-inicio', component: HomeManagementComponent},
      {path: 'administracion-de-novelas', component: NovelsManagementComponent},
      {path: 'administracion-de-novelas/:id', component: NovelManagementComponent},
      {path: 'administracion-de-novelas/:nid/:vid/:cid', component: ChapterManagementComponent},
      {path: 'administracion-de-novelas/:nid/:vid/:cid', component: ChapterManagementComponent},
      {path: 'administracion-de-pagina-de-inicio/noticias/:id/:name', component: AdvertisementManagementComponent},
      {path: 'administracion-de-pagina-de-inicio/noticias/:id', component: AdvertisementManagementComponent},
      {path: '', pathMatch: 'full', redirectTo: '' },
      { path: '**', pathMatch: 'full', redirectTo: '' }
    ]
  },
  // novel edition
  { path: 'mis-novelas', component: UserNovelsComponent, canActivate: [GuardService] },
  { path: 'mis-novelas/:nid', component: UserNovelComponent, canActivate: [GuardService] },
  { path: 'mis-novelas/:nid/:ntitle', component: UserNovelComponent, canActivate: [GuardService] },
  { path: 'mis-novelas/:nid/:ntitle/:vid/:cid', component: UserChapterComponent, canActivate: [GuardService] },
  { path: 'mis-novelas/:nid/:ntitle/:vid/:cid/:ctitle', component: UserChapterComponent, canActivate: [GuardService] },
  // forum
  { path: 'foro', component: ForumComponent },
  { path: 'foro/:category/:cid', component: ForumCategoryComponent },
  { path: 'foro/:category/:cid/:post/:id', component: ForumPostComponent },
  { path: 'perfil/:id', component: UserProfileComponent },
  { path: 'perfil/:id/:login', component: UserProfileComponent },
  // Invitations
  { path: 'invitaciones', component: InvitationsComponent },
  // Advertisements
  { path: 'noticias/:id', component: AdvertisementComponent },
  { path: 'noticias/:id/:name', component: AdvertisementComponent },
  // Bookmarks
  { path: 'lista-de-lectura', component: BookmarksComponent, canActivate: [GuardService] },
  // Test
  { path: 'test', component: TestComponent },
  // redirects
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
