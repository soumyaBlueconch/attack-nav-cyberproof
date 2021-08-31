import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { NavAppRoutingModule } from './nav-app-routing.module';
import { NavAppComponent } from './nav-app.component';
import { TabsComponent } from './tabs/tabs.component';

import { SharedModule } from '../shared/shared.module';
import { VersionUpgradeComponent } from './version-upgrade/version-upgrade.component';

import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    NavAppComponent,
    TabsComponent,
    VersionUpgradeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    NavAppRoutingModule,
    HttpClientModule

  ]
})
export class NavAppModule { }
