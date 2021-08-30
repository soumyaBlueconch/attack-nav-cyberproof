import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavAppRoutingModule } from './nav-app-routing.module';
import { NavAppComponent } from './nav-app.component';
import { TabsComponent } from './tabs/tabs.component';


@NgModule({
  declarations: [
    NavAppComponent,
    TabsComponent
  ],
  imports: [
    CommonModule,
    NavAppRoutingModule
  ]
})
export class NavAppModule { }
