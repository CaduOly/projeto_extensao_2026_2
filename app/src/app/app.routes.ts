import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'adm-panel', children: [] },
  { path: '', children: [] },
  { path: '**', redirectTo: '' }
];
