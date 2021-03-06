import { Component, OnInit } from '@angular/core';
import *  as  scoredLayer from 'src/app/shared/JSONS/viewModel.json';
@Component({
  selector: 'app-nav-app',
  templateUrl: './nav-app.component.html',
  styleUrls: ['./nav-app.component.scss']
})
export class NavAppComponent implements OnInit {
  inputScoredLayer = {
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
    "techniques": [],
    "gradient": {
        "colors": [
            "#ff6666",
            "#ffe766",
            "#8ec843"
        ],
        "minValue": 0,
        "maxValue": 100
    },
    "legendItems": [],
    "metadata": [],
    "showTacticRowBackground": false,
    "tacticRowBackground": "#dddddd",
    "selectTechniquesAcrossTactics": true,
    "selectSubtechniquesWithParent": false
}
  constructor() { }

  ngOnInit(): void {
  }

}
