import { Injectable } from '@angular/core';
import { DataService, Technique, Tactic } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private features = new Map<string, boolean | any>();
  public banner: string;
  private featureStructure: object[];
  public comment_color = "yellow";
  private featureGroups = new Map<string, string[]>();
  public contextMenuItems: ContextMenuItem[] = [];
  constructor(
    private dataService: DataService
  ) {
    let self = this;
    let subscription = dataService.getConfig().subscribe({
      next: function (config: any) {
        //parse feature preferences from config json
        config["features"].forEach(function (featureObject: any) {
          self.setFeature_object(featureObject);
        })
        //override json preferences with preferences from URL fragment
        self.getAllFragments().forEach(function (value: string, key: string) {
          let valueBool = (value == 'true');
          if (self.isFeature(key) || self.isFeatureGroup(key)) {
            // console.log("setting feature", key, valueBool)
            self.setFeature(key, valueBool);
          }
          // else {
          //     console.log(key, "is not a feature")
          // }
        })
        dataService.subtechniquesEnabled = self.getFeature("subtechniques");
        self.featureStructure = config["features"];
        self.comment_color = config["comment_color"];
        self.banner = config["banner"];
        for (let obj of config["custom_context_menu_items"]) {
          self.contextMenuItems.push(new ContextMenuItem(obj.label, obj.url, obj.subtechnique_url))
        }
      },
      complete: () => { if (subscription) subscription.unsubscribe(); } //prevent memory leaks
    });
  }
  public getFeature(featureName: string): boolean {
    return this.features.get(featureName);
  }
  public getFeatureList(): object[] {
    if (!this.featureStructure) return []
    return this.featureStructure;
  }

  /**
      * given a set of feature objects, set the enabledness of that object and all subobjects
      *
      * @param  featureObject {name: string, enabled: boolean, subfeatures?: featureObject[] }
      *                       Of enabled is false and it has subfeatures, they will all be forced to be false too
      * @param  override      Set all subfeatures, and their subfeatures, values to
      *                       this value
      */
  public setFeature_object(featureObject: any, override = null): string[] {
    let self = this

    // base case
    if (!featureObject.hasOwnProperty("subfeatures")) {

      let enabled = override !== null ? override : featureObject.enabled
      this.features.set(featureObject.name, enabled)
      return [featureObject.name]
    } else { //has subfeatures
      override = override ? override : !featureObject.enabled ? false : null;
      let subfeatures = [];
      featureObject.subfeatures.forEach(function (subfeature) {
        subfeatures = Array.prototype.concat(subfeatures, self.setFeature_object(subfeature, override))
      })
      this.featureGroups.set(featureObject.name, subfeatures)
      return subfeatures;
    }


  }
  /**
    * Get all url fragments
    * @param  url optional, url to parse instead of window location href
    * @return     all fragments as key-value pairs
    */
  getAllFragments(url?: string): Map<string, string> {
    if (!url) url = window.location.href;
    let fragments = new Map<string, string>();
    let regex = /[#&](\w+)=(\w+)/g

    // let results = url.match(regex)
    var match;
    while (match = regex.exec(url)) {
      fragments.set(match[1], match[2])
    }

    return fragments;
  }
  /**
   * Return if the given string corresponds to a defined feature
   * @param  featureName the name of the feature
   * @return             true if the feature exists, false otherwise
   */
  public isFeature(featureName: string): boolean {
    return this.features.has(featureName)
  }
  /**
  * return if the given string corresponds to a defined feature group
  * @param  featureGroupName the name of the feature group
  * @return                  true if it is a feature group, false otherwise
  */
  public isFeatureGroup(featureGroupName: string): boolean {
    return this.featureGroups.has(featureGroupName);
  }

  /**
   * Recursively search an object for boolean properties, set these as features
   * Take a key:value pair of an object. If the value is a boolean, set the
   * feature[key] to value. Otherwise recursively walk value to find boolean
   * options.
   *
   * Additionally, if the given feature grouping (where value is an obj)
   * has been previously defined, boolean properties assigned to the grouping
   * name will apply to all subfeatures of the grouping.
   *
   * @param  featureName string, the fieldname the value was found in
   * @param  value       boolean:object the value of the field. If a boolean,
   *                     sets feature[featureName] = value, otherwise walks recursively
   */
  public setFeature(featureName: string, value: any): string[] | any {
    let self = this
    // console.log(featureName, value);

    if (typeof (value) == "boolean") { //base case
      if (this.featureGroups.has(featureName)) { //feature group, assign to all subfeatures
        this.featureGroups.get(featureName).forEach(function (subFeatureName: string) {
          self.setFeature(subFeatureName, value);
        })
      } else { //single feature
        this.features.set(featureName, value);
      }
      return [featureName];
    }

    if (typeof (value) == "object") { //keep walking
      let subfeatures = [];
      Object.keys(value).forEach(function (fieldname: string) {
        subfeatures = Array.prototype.concat(subfeatures, self.setFeature(fieldname, value[fieldname]));
      })
      this.featureGroups.set(featureName, subfeatures);
      return subfeatures;
    }
  }
}
export class ContextMenuItem {
  public readonly label: string;
  private readonly url: string;
  private readonly subtechnique_url: string;

  constructor(label, url, subtechnique_url = null) {
    this.label = label;
    this.url = url;
    this.subtechnique_url = subtechnique_url;
  }

  public getReplacedURL(technique: Technique, tactic: Tactic): string {
    if (this.subtechnique_url && technique.isSubtechnique) {
      return this.subtechnique_url.replace(/{{parent_technique_attackID}}/g, technique.parent.attackID)
        .replace(/{{parent_technique_stixID}}/g, technique.parent.id)
        .replace(/{{parent_technique_name}}/g, technique.parent.name.replace(/ /g, "-").toLowerCase())

        .replace(/{{subtechnique_attackID}}/g, technique.attackID)
        .replace(/{{subtechnique_attackID_suffix}}/g, technique.attackID.split(".")[1])
        .replace(/{{subtechnique_stixID}}/g, technique.id)
        .replace(/{{subtechnique_name}}/g, technique.name.replace(/ /g, "-").toLowerCase())

        .replace(/{{tactic_attackID}}/g, tactic.attackID)
        .replace(/{{tactic_stixID}}/g, tactic.id)
        .replace(/{{tactic_name}}/g, tactic.shortname);
    } else {
      return this.url.replace(/{{technique_attackID}}/g, technique.attackID)
        .replace(/{{technique_stixID}}/g, technique.id)
        .replace(/{{technique_name}}/g, technique.name.replace(/ /g, "-").toLowerCase())

        .replace(/{{tactic_attackID}}/g, tactic.attackID)
        .replace(/{{tactic_stixID}}/g, tactic.id)
        .replace(/{{tactic_name}}/g, tactic.shortname);
    }
  }
}
