import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewModelsService } from '../../shared/services/viewmodels.service';
import { DataService } from '../../shared/services/data.service';
import * as globals from '../../shared/globals';

@Component({
  selector: 'app-version-upgrade',
  templateUrl: './version-upgrade.component.html',
  styleUrls: ['./version-upgrade.component.scss'],
})
export class VersionUpgradeComponent implements OnInit {
  nav_version = globals.nav_version;
  currVersion: string = '';
  vmVersion: string = '';
  layerName: string = '';
  dontAsk: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<VersionUpgradeComponent>,
    public dataService: DataService,
    private viewModelsService: ViewModelsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.currVersion = this.data.currVersion;
    this.vmVersion = this.data.vmVersion;
    this.layerName = this.data.layerName;
  }
  upgradeVersion(upgrade: boolean) {
    this.dialogRef.close({ upgrade: upgrade, dontAsk: this.dontAsk });
  }
}
