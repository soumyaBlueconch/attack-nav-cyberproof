import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'nav-app', pathMatch: 'full' },
  {
    path: 'nav-app',
    loadChildren: () =>
      import('./nav-app/nav-app.module').then((m) => m.NavAppModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
