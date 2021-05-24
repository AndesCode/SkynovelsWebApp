
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Guard services
import { GuardService } from './services/guard.service';
// Components
import { HomeComponent } from './components/home/home.component';
import { NovelsComponent } from './components/novels/novels.component';
import { NovelComponent } from './components/novel/novel.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { UsersManagementComponent } from './components/admin-panel/users-management/users-management.component';
import { UserManagementComponent } from './components/admin-panel/users-management/user-management/user-management.component';
import { UserNovelsComponent } from './components/user-novels/user-novels.component';
import { UserNovelComponent } from './components/user-novel/user-novel.component';
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
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { UserActivationComponent } from './components/user-activation/user-activation.component';
import { CloseDialogOnRouteService } from './services/close-dialog-on-route.service';
import { NotificationsComponent } from './components/notifications/notifications.component';
// TODO: forum proyect
/*import { ForumComponent } from './components/forum/forum.component';
import { ForumManagementComponent } from './components/admin-panel/forum-management/forum-management.component';
import { ForumCategoryComponent } from './components/forum/forum-category/forum-category.component';
import { ForumPostComponent } from './components/forum/forum-category/forum-post/forum-post.component';*/

const routes: Routes = [
  // home
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  // novels
  { path: 'novelas', component: NovelsComponent, canDeactivate: [CloseDialogOnRouteService] },
  { path: 'novelas/:nid', component: NovelComponent , canDeactivate: [CloseDialogOnRouteService]},
  { path: 'novelas/:nid/:ntitle', component: NovelComponent, canDeactivate: [CloseDialogOnRouteService] },
  { path: 'novelas/:nid/:ntitle/:cid', component: ChaptersComponent, canDeactivate: [CloseDialogOnRouteService] },
  { path: 'novelas/:nid/:ntitle/:cid/:ctitle', component: ChaptersComponent, canDeactivate: [CloseDialogOnRouteService] },
    // admin panel
  {
    path: 'panel',
    component: AdminPanelComponent,
    canActivate: [GuardService],
    children: [
      {path: 'administracion-de-usuarios', component: UsersManagementComponent},
      {path: 'administracion-de-usuarios/:id', component: UserManagementComponent, canDeactivate: [CloseDialogOnRouteService] },
      /*{path: 'administracion-del-foro', component: ForumManagementComponent},
      {path: 'administracion-del-foro/:id', component: ForumManagementComponent},*/
      {path: 'administracion-de-pagina-de-inicio', component: HomeManagementComponent},
      {path: 'administracion-de-novelas', component: NovelsManagementComponent, canDeactivate: [CloseDialogOnRouteService]},
      {path: 'administracion-de-novelas/:id', component: NovelManagementComponent, canDeactivate: [CloseDialogOnRouteService]},
      {path: 'administracion-de-novelas/:nid/:vid/:cid', component: ChapterManagementComponent, canDeactivate: [CloseDialogOnRouteService] },
      {path: 'administracion-de-pagina-de-inicio/noticias/:id/:name', component: AdvertisementManagementComponent, canDeactivate: [CloseDialogOnRouteService] },
      {path: 'administracion-de-pagina-de-inicio/noticias/:id', component: AdvertisementManagementComponent, canDeactivate: [CloseDialogOnRouteService] },
      {path: '', pathMatch: 'full', redirectTo: '' },
      { path: '**', pathMatch: 'full', redirectTo: '' }
    ]
  },
  // novel edition
  { path: 'mis-novelas', component: UserNovelsComponent, canActivate: [GuardService] },
  { path: 'mis-novelas/:nid', component: UserNovelComponent, canActivate: [GuardService], canDeactivate: [CloseDialogOnRouteService] },
  { path: 'mis-novelas/:nid/:ntitle', component: UserNovelComponent, canActivate: [GuardService], canDeactivate: [CloseDialogOnRouteService] },
  { path: 'mis-novelas/:nid/:ntitle/:vid/:cid', component: UserChapterComponent, canActivate: [GuardService], canDeactivate: [CloseDialogOnRouteService] },
  { path: 'mis-novelas/:nid/:ntitle/:vid/:cid/:ctitle', component: UserChapterComponent, canActivate: [GuardService], canDeactivate: [CloseDialogOnRouteService] },
  // forum
  /*{ path: 'foro', component: ForumComponent },
  { path: 'foro/:category/:cid', component: ForumCategoryComponent },
  { path: 'foro/:category/:cid/:post/:id', component: ForumPostComponent },*/
  // User profile
  { path: 'perfil/:id', component: UserProfileComponent },
  { path: 'perfil/:id/:login', component: UserProfileComponent },
  // Invitations
  { path: 'invitaciones', component: InvitationsComponent },
  // Advertisements
  { path: 'noticias/:id', component: AdvertisementComponent },
  { path: 'noticias/:id/:name', component: AdvertisementComponent },
  // Bookmarks
  { path: 'lista-de-lectura', component: BookmarksComponent, canActivate: [GuardService] },
  // Password recovery
  { path: 'nueva-contrasena/:token', component: PasswordRecoveryComponent },
  // User activation
  { path: 'activacion-de-usuario/:key', component: UserActivationComponent },
  // notifications
  { path: 'notificaciones', component: NotificationsComponent, canActivate: [GuardService] },
  // redirects
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
