import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { NavAppRoutingModule } from './nav-app-routing.module';
import { NavAppComponent } from './nav-app.component';
import { TabsComponent } from './tabs/tabs.component';

import { SharedModule } from '../shared/shared.module';
import { VersionUpgradeComponent } from './version-upgrade/version-upgrade.component';

import { HttpClientModule } from '@angular/common/http';
import { DataTableComponent } from './data-table/data-table.component';
import { MatrixSideComponent } from './matrix/matrix-side/matrix-side.component';
import { TacticCellComponent } from './matrix/tactic-cell/tactic-cell.component';
import { TechniqueCellComponent } from './matrix/technique-cell/technique-cell.component';
@NgModule({
  declarations: [
    NavAppComponent,
    TabsComponent,
    VersionUpgradeComponent,
    DataTableComponent,
    MatrixSideComponent,
    TacticCellComponent,
    TechniqueCellComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    NavAppRoutingModule,
    HttpClientModule
  ],
  exports:[
    NavAppComponent
  ]
})
export class NavAppModule { }
