import { Component, Input, ViewChild, HostListener, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { DataService, Technique, Matrix, Domain } from '../../shared/services/data.service';
import { ConfigService } from '../../shared/services/config.service';
import { TabsComponent } from '../tabs/tabs.component';
import { ViewModel, TechniqueVM, Filter, Gradient, Gcolor, ViewModelsService } from '../../shared/services/viewmodels.service';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuTrigger } from '@angular/material/menu';
import * as Excel from 'exceljs/dist/es5/exceljs.browser';
import * as is from 'is_js';
declare var tinygradient: any; //use tinygradient
import * as tinycolor from 'tinycolor2';

import * as FileSaver from 'file-saver';
import { ColorPickerModule } from 'ngx-color-picker';
// import { TechniquesSearchComponent } from '../techniques-search/techniques-search.component';
import { TmplAstVariable } from '@angular/compiler'
@Component({
  selector: 'DataTable',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  // The ViewModel being used by this data-table
  @Input() viewModel: ViewModel;
  currentDropdown: string = ""; //current dropdown menu
  constructor(
    public dataService: DataService,
    private tabs: TabsComponent,
    private sanitizer: DomSanitizer,
    private viewModelsService: ViewModelsService,
    public configService: ConfigService
  ) { }

  ngOnInit(): void {
  }
  // edit field bindings
  commentEditField: string = "";
  scoreEditField: string = "";
  /**
     * triggered on left click of technique
     * @param  technique      technique which was left clicked
     * @param  addToSelection add to the technique selection (shift key) or replace selection?
     */
  onTechniqueSelect(technique?, addToSelection?, eventX?, eventY?): void {

    if (!this.viewModel.isCurrentlyEditing()) {
      if (["comment", "score", "colorpicker"].includes(this.currentDropdown)) this.currentDropdown = ""; //remove technique control dropdowns, because everything was deselected
      return;
    }
    //else populate editing controls
    this.populateEditFields();
  }
  /**
     * populate edit fields. Gets common values if common values exist for all editing values
     */
  populateEditFields(): void {
    this.commentEditField = this.viewModel.getEditingCommonValue("comment");
    this.scoreEditField = this.viewModel.getEditingCommonValue("score");
  }

}
