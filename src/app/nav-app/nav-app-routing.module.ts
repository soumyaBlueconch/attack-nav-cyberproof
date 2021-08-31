import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavAppComponent } from './nav-app.component';

const routes: Routes = [{ path: '', component: NavAppComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavAppRoutingModule {}
