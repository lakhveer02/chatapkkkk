import { Routes } from '@angular/router';
import { AuthGuard } from './gurads/auth/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'userlist',
    loadComponent: () => import('./pages/userlist/userlist.page').then(m => m.UserlistPage)
  },
  {
    path: 'home/chats/:id',
    loadComponent: () => import('./pages/chat/chat.page').then(m => m.ChatPage),
  },
  {
    path: 'chat-box',
    loadComponent: () => import('./pages/chat-box/chat-box.page').then(m => m.ChatBoxPage)
  },
  {
    path: 'empty-screen',
    loadComponent: () => import('./pages/empty-screen/empty-screen.page').then(m => m.EmptyScreenPage)
  },
  {
    path: 'login/signup',
    loadComponent: () => import('./homes/signup/signup.page').then(m => m.SignupPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./homes/login/login.page').then(m => m.LoginPage)
  },
];
