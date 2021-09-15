import { Component, OnInit, AfterContentInit, AfterViewInit, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import {
  ViewModelsService,
  ViewModel,
} from '../../shared/services/viewmodels.service';
import { DataService } from '../../shared/services/data.service';
import { ConfigService } from '../../shared/services/config.service';
import { GenerateHeatmapJsonService } from "../../shared/services/generate-heatmap-json.service";
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent implements AfterViewInit, OnChanges, AfterContentInit {
  loadURL: string = '';
  activeTab: Tab | any = null;
  layerTabs: Tab[] = [];
  alwaysUpgradeVersion: boolean | undefined;
  customizedConfig = [];
  bannerContent: string;
  @Input() scoredLayer;
  viewMod;
  constructor(
    private viewModelsService: ViewModelsService,
    private dataService: DataService,
    private generateHeatMapService: GenerateHeatmapJsonService
  ) { }

  ngOnChanges(): void {
    // this.readJSON();
  }
  ngAfterContentInit() {
    this.dataService.initializeDomains().then(() => {
      this.newLayer(this.dataService.domains[0].id);
      this.generateHeatMapService.getDomainTechniqueList();
    });
  }
  newLayer(domainID: string) {
    // load domain data, if not yet loaded
    if (!this.dataService.getDomain(domainID).dataLoaded) {
      this.dataService.loadDomainData(domainID, true);
    }

    // find non conflicting name
    let name = this.getUniqueLayerName("layer")

    // create and open VM
    let vm = this.viewModelsService.newViewModel(name, domainID);
    vm.loadVMData();
  }
  getUniqueLayerName(root: string) {
    let conflictNumber = 0;
    let viewModels = this.viewModelsService.viewModels

    function isInteger(str) {
      var n = Math.floor(Number(str));
      return String(n) === str;
    }

    for (let i = 0; i < viewModels.length; i++) {
      if (!viewModels[i].name.startsWith(root)) continue;
      if (viewModels[i].name === root) { //case where it's "new layer" aka  "new layer 0"
        conflictNumber = Math.max(conflictNumber, 1);
        continue;
      }

      let numberPortion = viewModels[i].name.substring(root.length, viewModels[i].name.length)

      //find lowest number higher than existing number
      if (isInteger(numberPortion)) {
        conflictNumber = Math.max(conflictNumber, Number(numberPortion) + 1)
      }
    }
    // if no layers of this name exist (conflictNumber == 0) just return root
    if (conflictNumber != 0) root = root + conflictNumber
    return root;
  }
  ngAfterViewInit() { }
  domain: string = '';
  gradient: ViewModel = null;
  coloring: ViewModel = null;
  comments: ViewModel = null;
  enabledness: ViewModel = null;
  filters: ViewModel = null;
  scoreExpression: string = '';
  legendItems: ViewModel = null;


  readJSON() {
    this.generateHeatMapService.createScoreJson();
    let viewModel = this.viewModelsService.newViewModel(
      'loading layer...',
      undefined
    );
    let string = this.generateHeatMapService.jsonTemplate;
    try {
      viewModel.deSerializeDomainID(string);
      if (!this.dataService.getDomain(viewModel.domainID)) {
        throw {
          message:
            "Error: '" +
            viewModel.domain +
            "' (" +
            viewModel.version +
            ') is an invalid domain.',
        };
      }
      viewModel.deSerialize(string);
      viewModel.loadVMData();
      this.viewMod = viewModel;

    } catch (err) {
      console.error(
        'ERROR: Either the file is not JSON formatted, or the file structure is invalid.',
        err
      );
      alert(
        'ERROR: Either the file is not JSON formatted, or the file structure is invalid.'
      );
      this.viewModelsService.destroyViewModel(viewModel);
    }
  }

}
export class Tab {
  title: string;
  dataContext: any;
  domain: string = '';
  isDataTable: boolean;

  isCloseable: boolean = false;
  showScoreVariables: boolean = false;

  constructor(
    title: string,
    isCloseable: boolean,
    showScoreVariables: boolean,
    domain: string,
    dataTable: boolean
  ) {
    this.title = title;
    this.isCloseable = isCloseable;
    this.showScoreVariables = showScoreVariables;
    this.domain = domain;
    this.isDataTable = dataTable;
  }
}
