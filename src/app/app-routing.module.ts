
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardService } from './services/guard.service';
import { HomeComponent } from './components/home/home.component';
import { NovelsComponent } from './components/novels/novels.component';
import { NovelComponent } from './components/novel/novel.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { UserManagementComponent } from './components/admin-panel/user-management/user-management.component';
import { ForumManagementComponent } from './components/admin-panel/forum-management/forum-management.component';
import { UserNovelsComponent } from './components/user-novels/user-novels.component';
import { UserNovelComponent } from './components/user-novel/user-novel.component';
import { ForumComponent } from './components/forum/forum.component';
import { ForumCategoryComponent } from './components/forum/forum-category/forum-category.component';
import { ForumPostComponent } from './components/forum/forum-category/forum-post/forum-post.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ChaptersComponent } from './components/chapters/chapters.component';
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
  { path: 'novelas/:id/:name', component: NovelComponent },
  { path: 'novelas/:nid/:ntitle/:cid/:ctitle', component: ChaptersComponent },
    // admin panel
  {
    path: 'panel',
    component: AdminPanelComponent,
    canActivate: [GuardService],
    children: [
      {path: 'administracion-de-usuarios', component: UserManagementComponent},
      {path: 'administracion-de-usuarios/:id', component: UserManagementComponent},
      {path: 'administracion-del-foro', component: ForumManagementComponent},
      {path: 'administracion-del-foro/:id', component: ForumManagementComponent},
      {path: '', pathMatch: 'full', redirectTo: '' },
      { path: '**', pathMatch: 'full', redirectTo: '' }
    ]
    /*children: [
      {path: 'analisis', component: AnalyticsComponent},
      {path: 'administracion-de-usuarios', component: UserManagementComponent},
      {path: 'administracion-de-usuarios/:id', component: UserManagementComponent},
      {path: 'administracion-de-novelas', component: NovelManagementComponent},
      {path: 'administracion-de-novelas/:id', component: NovelAdminEditionComponent},
      {path: 'administracion-de-novelas/:id/editar-capitulo/:chp', component: NovelAdminEditionComponent},
      {path: '', pathMatch: 'full', redirectTo: '' },
      { path: '**', pathMatch: 'full', redirectTo: '' }
    ]*/
  },
  { path: 'mis-novelas', component: UserNovelsComponent, canActivate: [GuardService] },
  { path: 'mi-novela/:id', component: UserNovelComponent },
  { path: 'foro', component: ForumComponent },
  { path: 'foro/:category/:cid', component: ForumCategoryComponent },
  { path: 'foro/:category/:cid/:post/:id', component: ForumPostComponent },
  { path: 'perfil/:login/:id', component: UserProfileComponent },
  // Test
  { path: 'test', component: TestComponent },
  // redirects
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

/*const routes: Routes = [
  // home
  { path: '', component: HomeComponent },

  // users
  { path: 'iniciar-sesion', component: LoginComponent },
  {
    path: 'registrarse',
    component: HomeComponent,
    canActivate: [GuardService]
  },
  {
    path: 'invitaciones',
    component: InvitationsComponent,
    canActivate: [GuardService]
  },
  {
    path: 'styles-test',
    component: DevStylesTestComponent,
    canActivate: [GuardService]
  },
  { path: 'perfil/:login/:id', component: UserProfileComponent },
  { path: 'verificacion/:key', component: EmailVerificationComponent },
  { path: 'reseteo-de-contraseña/:token', component: NewPasswordFormComponent },
  // redirects
  // {path: '', pathMatch: 'full', redirectTo: '' },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];*/

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
