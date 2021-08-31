import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
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
})
export class TabsComponent implements OnInit, AfterContentInit, AfterViewInit {
  loadURL: string = '';
  activeTab: Tab | any = null;
  layerTabs: Tab[] = [];
  alwaysUpgradeVersion: boolean | undefined;
  customizedConfig = [];
  bannerContent: string;
  constructor(
    private dialog: MatDialog,
    private viewModelsService: ViewModelsService,
    private http: HttpClient,
    private dataService: DataService,
    private configService: ConfigService
  ) { }

  ngOnInit(): void { }
  ngAfterContentInit() {
    let subscription = this.dataService.getConfig().subscribe({
      next: (config: Object) => {
        this.newBlankTab();
        this.loadTabs(config["default_layers"]).then(() => {
          if (this.layerTabs.length == 0) {
            this.newLayer(this.dataService.domains[0].id); // failed load from url, so create new blank layer
          }
          // let activeTabs = this.layerTabs.filter((tab)=>tab.active);

          // if there is no active tab set, activate the first
          if (!this.activeTab) { this.selectTab(this.layerTabs[0]); }
        });
        this.customizedConfig = this.configService.getFeatureList()
        this.bannerContent = this.configService.banner;
      },
      complete: () => { if (subscription) subscription.unsubscribe(); } //prevent memory leaks
    });
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
  /**
   * Return true if the text is only letters a-z, false otherwise
   * @param  text text to eval
   * @return      true if a-z, false otherwise
   */
  alphabetical(text: string): boolean {
    return /^[a-z]+$/.test(text);
  }
  /**
 * Get a layer score expression variable for a tab
 * @param  index index of tab
 * @return       char expression variable
 */
  indexToChar(index: number) {
    let realIndex = 0;
    for (let i = 0; i < index; i++) {
      if (this.layerTabs[i].dataContext) realIndex++;
    }
    return String.fromCharCode(97 + realIndex);
  }
  /**
   * open upload new layer prompt
   */
  openUploadPrompt(): void {
    let input = <HTMLInputElement>document.getElementById('uploader');
    input.click();
  }
  /**
   * Loads an existing layer into a tab
   */

  loadLayerFromFile(): void {
    var input: any = <HTMLInputElement>document.getElementById('uploader');
    if (input.files.length < 1) {
      alert('You must select a file to upload!');
      return;
    }
    this.readJSONFile(input.files[0]);
  }
  /**
   * Retrieves a file from the input element,
   * reads the json,
   * and adds the properties to a new viewModel, and loads that viewmodel into a new layer.
   */
  readJSONFile(file: File) {
    // var input = (<HTMLInputElement>document.getElementById("uploader"));
    var reader = new FileReader();
    let viewModel = this.viewModelsService.newViewModel(
      'loading layer...',
      undefined
    );

    reader.onload = (e) => {
      var string = String(reader.result);
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
        this.versionUpgradeDialog(viewModel)
          .then(() => {
            this.openTab('new layer', viewModel, true, true, true, true);
            if (!this.dataService.getDomain(viewModel.domainID).dataLoaded) {
              this.dataService
                .loadDomainData(viewModel.domainID, true)
                .then(() => {
                  viewModel.deSerialize(string);
                  viewModel.loadVMData();
                });
            } else {
              viewModel.deSerialize(string);
              viewModel.loadVMData();
            }
          })
          .catch((err) => {
            console.error(err.message);
            alert(
              'ERROR parsing file, check the javascript console for more information.'
            );
          });
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
    };
    reader.readAsText(file);
  }
  /**
   * Dialog to upgrade version if layer is not the latest version
   */
  versionUpgradeDialog(viewModel: any): Promise<any> {
    let dataPromise: Promise<any> = new Promise((resolve, reject) => {
      let currVersion = this.dataService.getCurrentVersion();
      if (this.alwaysUpgradeVersion) {
        // remember user choice to always upgrade layer
        viewModel.version = currVersion;
        viewModel.domainID = this.dataService.getDomainID(
          viewModel.domain,
          viewModel.version
        );
        resolve(null);
      } else if (
        viewModel.version !== currVersion &&
        this.alwaysUpgradeVersion == undefined
      ) {
        // ask to upgrade
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.width = '25%';
        dialogConfig.data = {
          layerName: viewModel.name,
          vmVersion: viewModel.version,
          currVersion: currVersion,
        };
        const dialogRef = this.dialog.open(
          VersionUpgradeComponent,
          dialogConfig
        );
        let subscription = dialogRef.afterClosed().subscribe({
          next: (result) => {
            if (
              !result.upgrade &&
              !this.dataService.isSupported(viewModel.version)
            ) {
              reject(
                'Uploaded layer version (' +
                String(viewModel.version) +
                ') is not supported by Navigator v' +
                globals.nav_version
              );
            }
            if (result.dontAsk) {
              this.alwaysUpgradeVersion = result.upgrade;
            }
            if (result.upgrade) {
              viewModel.version = currVersion;
              viewModel.domainID = this.dataService.getDomainID(
                viewModel.domain,
                viewModel.version
              );
            }
            resolve(null);
          },
          complete: () => {
            if (subscription) subscription.unsubscribe();
          }, //prevent memory leaks
        });
      } else {
        // remember user choice not to upgrade or layer is already current version
        resolve(null);
      }
    });
    return dataPromise;
  }
  selectTab(tab: Tab) {
    // deactivate all tabs
    // this.layerTabs.forEach(tab => tab.active = false);
    this.activeTab = tab;
    // activate the tab the user has clicked on.
    // tab.active = true;
  }

  /**
     * Open a new tab
     * @param  {[type]}  title               title of new tab
     * @param  {[type]}  data                data to put in template
     * @param  {Boolean} [isCloseable=false] can this tab be closed?
     * @param  {Boolean} [replace=false]     replace the current tab with the new tab, TODO
     * @param  {Boolean} [forceNew=false]    force open a new tab even if a tab of that name already exists
     * @param  {Boolean} [dataTable=false]   is this a data-table tab? if so tab text should be editable

     */
  openTab(
    title: string,
    data: any,
    isCloseable = false,
    replace = true,
    forceNew = false,
    dataTable = false
  ) {
    // determine if tab is already open. If it is, just change to that tab
    if (!forceNew) {
      for (let i = 0; i < this.layerTabs.length; i++) {
        if (this.layerTabs[i].title === title) {
          this.selectTab(this.layerTabs[i]);
          return;
        }
      }
    }

    // create a new tab
    let domain = data ? data.domainID : '';
    let tab = new Tab(title, isCloseable, false, domain, dataTable);
    tab.dataContext = data;

    // select new tab
    if (!replace || this.layerTabs.length === 0) {
      this.layerTabs.push(tab); //don't replace
      this.selectTab(this.layerTabs[this.layerTabs.length - 1]);
    } else {
      // find active tab index
      for (let i = 0; i < this.layerTabs.length; i++) {
        if (this.layerTabs[i] == this.activeTab) {
          this.closeActiveTab(true); //close current and don't let it create a replacement tab
          this.layerTabs.splice(i, 0, tab); //replace
          this.selectTab(this.layerTabs[i]);
          return;
        }
      }
    }
  }
  /**
   * Close the currently selected tab
   * @param  {[type]} allowNoTab=false if true, doesn't select another tab, and won't open a new tab if there are none
   */
  closeActiveTab(allowNoTab = false) {
    if (this.activeTab) this.closeTab(this.activeTab, allowNoTab);
    // this.activeTab = null;
    // let activeTabs = this.layerTabs.filter((tab)=>tab.active);
    // if(activeTabs.length > 0)  {
    //     // close the 1st active tab (should only be one at a time)
    //     this.closeTab(activeTabs[0], allowNoTab);
    // }
  }
  /**
   * close a tab
   * @param  {Tab} tab              tab to close
   * @param  {[type]}       allowNoTab=false if true, doesn't select another tab, and won't open a new tab if there are none
   */
  closeTab(tab: Tab, allowNoTab = false) {
    let action = 0; //controls post close-tab behavior

    // destroy tab viewmodel
    this.viewModelsService.destroyViewModel(tab.dataContext);

    for (let i = 0; i < this.layerTabs.length; i++) {
      if (this.layerTabs[i] === tab) {
        //close this tab

        if (this.layerTabs[i] == this.activeTab) {
          //is the tab we're closing currently open??
          if (i == 0 && this.layerTabs.length > 1) {
            //closing first tab, first tab is active, and more tabs exist
            action = 1;
          } else if (i > 0) {
            //closing not first tab, implicitly more tabs exist
            action = 2;
          } else {
            //else closing first tab and no other tab exist
            action = 3;
          }
        }
        // remove the tab from our array
        this.layerTabs.splice(i, 1);
        break;
      }
    }

    // post close-tab behavior: select new tab?
    if (!allowNoTab) {
      switch (action) {
        case 0: //should only occur if the active tab is not closed: don't select another tab
          break;
        case 1: //closing the first tab, more exist
          this.selectTab(this.layerTabs[0]); // select first tab
          break;
        case 2: //closing any tab other than the first
          this.selectTab(this.layerTabs[0]); //select first tab
          break;
        case 3: //closing first tab and no other tab exist
          this.newBlankTab(); //make a new blank tab, automatically opens this tab
          break;
        default:
          //should never occur
          console.error(
            'post closetab action not specified (this should never happen)'
          );
      }
    }
  }
  //  _      ___   _____ ___   ___ _____ _   _ ___ ___
  // | |    /_\ \ / / __| _ \ / __|_   _| | | | __| __|
  // | |__ / _ \ V /| _||   / \__ \ | | | |_| | _|| _|
  // |____/_/ \_\_| |___|_|_\ |___/ |_|  \___/|_| |_|

  /**
   * open a new "blank" tab showing a new layer button and an open layer button
   * @param  {[type]} replace=false replace the current tab with this blank tab?
   */
  newBlankTab(replace = false) {
    this.openTab('new tab', null, true, replace, true, false);
  }
  /**
   * attempt an HTTP GET to loadURL, and load the response (if it exists) as a layer.
   */
  loadLayerFromURL(loadURL: string, replace: any): Promise<any> {
    let layerPromise: Promise<any> = new Promise((resolve, reject) => {
      // if (!loadURL.startsWith("http://") && !loadURL.startsWith("https://") && !loadURL.startsWith("FTP://")) loadURL = "https://" + loadURL;
      let subscription = this.http.get(loadURL).subscribe({
        next: (res) => {
          let viewModel = this.viewModelsService.newViewModel(
            'loading layer...',
            undefined
          );
          try {
            viewModel.deSerializeDomainID(res);
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
            this.versionUpgradeDialog(viewModel)
              .then(() => {
                this.openTab('new layer', viewModel, true, replace, true, true);
                if (
                  !this.dataService.getDomain(viewModel.domainID).dataLoaded
                ) {
                  this.dataService
                    .loadDomainData(viewModel.domainID, true)
                    .then(() => {
                      viewModel.deSerialize(res);
                      viewModel.loadVMData();
                      resolve(null);
                    });
                } else {
                  viewModel.deSerialize(res);
                  viewModel.loadVMData();
                  resolve(null);
                }
              })
              .catch((err) => {
                console.error(err.message);
                alert(
                  'ERROR parsing layer from ' +
                  loadURL +
                  ', check the javascript console for more information.'
                );
                resolve(null);
              });
            console.log('loaded layer from', loadURL);
          } catch (err) {
            console.error(err);
            this.viewModelsService.destroyViewModel(viewModel);
            alert(
              'ERROR parsing layer from ' +
              loadURL +
              ', check the javascript console for more information.'
            );
            resolve(null); //continue
          }
        },
        error: (err) => {
          console.error(err);
          if (err.status == 0) {
            // no response
            alert(
              'ERROR retrieving layer from ' +
              loadURL +
              ', check the javascript console for more information.'
            );
          } else {
            // response, but not a good one
            alert(
              'ERROR retrieving layer from ' +
              loadURL +
              ', check the javascript console for more information.'
            );
          }
          resolve(null); //continue
        },
        complete: () => {
          if (subscription) subscription.unsubscribe();
        }, //prevent memory leaks
      });
    });
    return layerPromise;
  }
  hasFeature(featureName: string): boolean {
    // console.log(featureName+` ${this.configService.getFeature(featureName)}`);
    return this.configService.getFeature(featureName);
  }
  getActiveTab() {
    return this.activeTab;
    // let activeTabs = this.layerTabs.filter((tab)=>tab.active);
    // return activeTabs[0];
  }
  /**
  * Open initial tabs on application load
  */
  loadTabs(defaultLayers): Promise<any> {
    let loadPromise: Promise<any> = new Promise((resolve, reject) => {
      let fragment_value = this.getNamedFragmentValue("layerURL");
      if (fragment_value && fragment_value.length > 0) {
        let first = true;
        let self = this;
        (async function () {
          for (var _i = 0, urls_1 = fragment_value; _i < urls_1.length; _i++) {
            var url = urls_1[_i];
            await self.loadLayerFromURL(url, first);
            first = false;
          }
          resolve(null);
        })();
      } else if (defaultLayers["enabled"]) {
        let first = true;
        let self = this;
        (async function () {
          for (let url of defaultLayers["urls"]) {
            await self.loadLayerFromURL(url, first);
            first = false;
          }
          resolve(null);
        })();
      }
      resolve(null);
    });
    return loadPromise;
  }
  /**
  * get a key=value fragment value by key
  * @param  {string} name name of param to get the value of
  * @param  {string} url  optional, if unspecified searches in current window location. Otherwise searches this string
  * @return {string}      fragment param value
  */
  getNamedFragmentValue(name: string, url?: string): any {

    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[#&]" + name + "(?:=([^&#]*)|&|#|$)", "g");
    //match as many results as exist under the name
    let results = [];
    let match = regex.exec(url);
    while (match != null) {
      results.push(decodeURIComponent(match[1].replace(/\+/g, " ")));
      match = regex.exec(url);
    }
    return results
  }
  /**
  * Open a new blank layer tab
  */
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
    this.openTab(name, vm, true, true, true, true)
  }
  /**
     * Given a unique root, returns a layer name that does not conflict any existing layers, e.g 'new layer' -> 'new layer 1'
     * @param  {string} root the root string to get the non-conflicting version of
     * @return {string}      non-conflicted version
     */
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
