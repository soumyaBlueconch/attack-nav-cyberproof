import { Component, OnInit, AfterContentInit, AfterViewInit, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import {
  ViewModelsService,
  ViewModel,
} from '../../shared/services/viewmodels.service';
import { DataService } from '../../shared/services/data.service';
import { ConfigService } from '../../shared/services/config.service';
import { VersionUpgradeComponent } from '../version-upgrade/version-upgrade.component';
import { HttpClient } from '@angular/common/http';
import * as globals from '../../shared/globals';
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
    private dialog: MatDialog,
    private viewModelsService: ViewModelsService,
    private http: HttpClient,
    private dataService: DataService,
    private configService: ConfigService
  ) { }

  ngOnChanges(): void {
    // this.readJSON();
  }
  ngAfterContentInit() {
    this.dataService.initializeDomains().then(() => {
      this.newLayer(this.dataService.domains[0].id);
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
    let viewModel = this.viewModelsService.newViewModel(
      'loading layer...',
      undefined
    );

    var string = {
      "name": "layer",
      "versions": {
        "attack": "9",
        "navigator": "4.3",
        "layer": "4.2"
      },
      "domain": "enterprise-attack",
      "description": "",
      "filters": {
        "platforms": [
          "Linux",
          "macOS",
          "Windows",
          "Azure AD",
          "Office 365",
          "SaaS",
          "IaaS",
          "Google Workspace",
          "PRE",
          "Network",
          "Containers"
        ]
      },
      "sorting": 0,
      "layout": {
        "layout": "side",
        "aggregateFunction": "average",
        "showID": false,
        "showName": true,
        "showAggregateScores": false,
        "countUnscored": false
      },
      "hideDisabled": false,
      "techniques": [
        {
          "techniqueID": "T1548.002",
          "tactic": "privilege-escalation",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1548.002",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1087",
          "tactic": "discovery",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1098.001",
          "tactic": "persistence",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1098.002",
          "tactic": "persistence",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1583.001",
          "tactic": "resource-development",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1583.006",
          "tactic": "resource-development",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1071.001",
          "tactic": "command-and-control",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1560.001",
          "tactic": "collection",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1547.001",
          "tactic": "persistence",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1547.001",
          "tactic": "privilege-escalation",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1547.009",
          "tactic": "persistence",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1547.009",
          "tactic": "privilege-escalation",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1059.001",
          "tactic": "execution",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1059.003",
          "tactic": "execution",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1059.006",
          "tactic": "execution",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1584.001",
          "tactic": "resource-development",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1555",
          "tactic": "credential-access",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1001.002",
          "tactic": "command-and-control",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1074.002",
          "tactic": "collection",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1005",
          "tactic": "collection",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1140",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1587.001",
          "tactic": "resource-development",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1587.003",
          "tactic": "resource-development",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1484.002",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1484.002",
          "tactic": "privilege-escalation",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1482",
          "tactic": "discovery",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1568",
          "tactic": "command-and-control",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1114.002",
          "tactic": "collection",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1546.003",
          "tactic": "privilege-escalation",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1546.003",
          "tactic": "persistence",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1546.008",
          "tactic": "privilege-escalation",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1546.008",
          "tactic": "persistence",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1048.002",
          "tactic": "exfiltration",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1190",
          "tactic": "initial-access",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1203",
          "tactic": "execution",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1133",
          "tactic": "persistence",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1133",
          "tactic": "initial-access",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1083",
          "tactic": "discovery",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1606.001",
          "tactic": "credential-access",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1606.002",
          "tactic": "credential-access",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1562.001",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1562.002",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1562.004",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1070",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1070.004",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1070.006",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1105",
          "tactic": "command-and-control",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1036",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1036.004",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1036.005",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1095",
          "tactic": "command-and-control",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1003.006",
          "tactic": "credential-access",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1027",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1027.002",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1069",
          "tactic": "discovery",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1566.001",
          "tactic": "initial-access",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1566.002",
          "tactic": "initial-access",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1057",
          "tactic": "discovery",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1090.001",
          "tactic": "command-and-control",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1090.003",
          "tactic": "command-and-control",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1090.004",
          "tactic": "command-and-control",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1021.006",
          "tactic": "lateral-movement",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1018",
          "tactic": "discovery",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1053.005",
          "tactic": "execution",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1053.005",
          "tactic": "persistence",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1053.005",
          "tactic": "privilege-escalation",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1218.011",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1558.003",
          "tactic": "credential-access",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1553.002",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1195.002",
          "tactic": "initial-access",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1082",
          "tactic": "discovery",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1016.001",
          "tactic": "discovery",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1552.004",
          "tactic": "credential-access",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1550",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1550",
          "tactic": "lateral-movement",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1550.003",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1550.003",
          "tactic": "lateral-movement",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1550.004",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1550.004",
          "tactic": "lateral-movement",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1204.001",
          "tactic": "execution",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1204.002",
          "tactic": "execution",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1078",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1078",
          "tactic": "persistence",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1078",
          "tactic": "privilege-escalation",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1078",
          "tactic": "initial-access",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1078.002",
          "tactic": "defense-evasion",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1078.002",
          "tactic": "persistence",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1078.002",
          "tactic": "privilege-escalation",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1078.002",
          "tactic": "initial-access",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1102.002",
          "tactic": "command-and-control",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        },
        {
          "techniqueID": "T1047",
          "tactic": "execution",
          "score": 1,
          "color": "",
          "comment": "",
          "enabled": true,
          "metadata": [],
          "showSubtechniques": false
        }
      ],
      "gradient": {
        "colors": [
          "#8ec843",
          "#ffe766",
          "#ff6666"
        ],
        "minValue": 0,
        "maxValue": 3
      },
      "legendItems": [],
      "metadata": [],
      "showTacticRowBackground": false,
      "tacticRowBackground": "#dddddd",
      "selectTechniquesAcrossTactics": true,
      "selectSubtechniquesWithParent": false
    }
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
