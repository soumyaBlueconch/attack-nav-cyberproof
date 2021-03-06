import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigService } from 'src/app/shared/services/config.service';
import { Technique, Tactic, Matrix, DataService } from '../../../shared/services/data.service';
import { ViewModel } from '../../../shared/services/viewmodels.service';
// declare var tinycolor: any; //use tinycolor2
import * as tinycolor from 'tinycolor2';
@Component({
  selector: 'technique-cell',
  templateUrl: './technique-cell.component.html',
  styleUrls: ['./technique-cell.component.scss']
})
export class TechniqueCellComponent implements OnInit {
  @Input() tactic: Tactic;
  @Input() technique: Technique;
  @Input() viewModel: ViewModel;
  @Input() matrix: Matrix;
  @Output() highlight = new EventEmitter<any>(); // emit with the highlighted technique, or null to unhighlight
  @Output() unhighlight = new EventEmitter<any>();
  @Output() leftclick = new EventEmitter<any>(); // emit with the selected technique and the modifier keys
  public showContextmenu: boolean = false;
  constructor(
    public configService: ConfigService,
    public dataService: DataService
  ) { }

  ngOnInit(): void {
  }
  /**
      * get the technique background style for ngstyle
      * @param  technique technique
      * @return           background object
      */
  public getTechniqueBackground(): any {
    let tvm = this.viewModel.getTechniqueVM(this.technique, this.tactic)
    // don't display if disabled or highlighted
    if (!tvm.enabled || this.isHighlighted) return null
    if (tvm.color) return { "background": tvm.color }
    if (this.viewModel.layout.showAggregateScores && !isNaN(Number(tvm.aggregateScore))) return { "background": tvm.aggregateScoreColor }
    if (tvm.score) return { "background": tvm.scoreColor }
    // return tvm.enabled && tvm.score && !tvm.color && !(this.viewModel.highlightedTechnique && this.viewModel.highlightedTechnique.technique_id == technique.technique_id)
  }
  public get isHighlighted(): boolean {
    if (this.viewModel.highlightedTactic) {
      if (this.viewModel.selectTechniquesAcrossTactics) {
        if (this.viewModel.selectSubtechniquesWithParent) {
          let compareTo = this.viewModel.highlightedTechnique;
          if (compareTo.isSubtechnique) compareTo = compareTo.parent;
          let compare = this.technique;
          if (compare.isSubtechnique) compare = compare.parent;
          if (compare.attackID == compareTo.attackID) return true;
        } else if (this.viewModel.highlightedTechnique.id == this.technique.id) {
          return true;
        }
      } else if (this.viewModel.highlightedTactic.id == this.tactic.id) {
        if (this.viewModel.selectSubtechniquesWithParent) {
          let compareTo = this.viewModel.highlightedTechnique;
          if (compareTo.isSubtechnique) compareTo = compareTo.parent;
          let compare = this.technique;
          if (compare.isSubtechnique) compare = compare.parent;
          if (compare.attackID == compareTo.attackID) return true;
        } else if (this.viewModel.highlightedTechnique.id == this.technique.id) {
          return true;
        }
      }
    }

    return this.showContextmenu;
  }
  /**
      * Return css classes for a technique
      * @param  {technique} technique the technique to get the class of
      * @param  {boolean}   mini is it the minitable?
      * @return {string}               the classes the technique should currently have
      */
  public getClass(): string {
    let theclass = 'link noselect cell'
    if (this.viewModel.isTechniqueSelected(this.technique, this.tactic))
      theclass += " editing"
    if (this.isHighlighted) { //open context menu always keeps highlight even if the mouse has moved elsewhere
      theclass += " highlight";
    }

    // classes added by layout config
    if (this.viewModel.layout.showID)
      theclass += " showID"
    if (this.viewModel.layout.showName)
      theclass += " showName"
    theclass += " " + this.viewModel.layout.layout;

    // classes according to annotations
    if (this.viewModel.getTechniqueVM(this.technique, this.tactic).comment.length > 0 || this.hasNotes())
      theclass += " commented"
    if (this.getTechniqueBackground())
      theclass += " colored"
    if (!this.viewModel.getTechniqueVM(this.technique, this.tactic).enabled)
      theclass += " disabled"

    // classes by annotated sub-techniques
    if (!this.annotatedSubtechniques())
      theclass += " unannotated"

    return theclass
  }
  // count number of annotated sub-techniques on this technique
  public annotatedSubtechniques() {
    let annotatedSubs: Technique[] = []
    for (let s of this.technique.subtechniques) {
      let subVM = this.viewModel.getTechniqueVM(s, this.tactic);
      if (subVM.annotated()) annotatedSubs.push(s);
    }
    return this.applyControls(annotatedSubs, this.tactic).length;
  }
  /**
       * Check if technique has notes
       * @return      true if technique has notes, false otherwise
       */
  public hasNotes() {
    let domain = this.dataService.getDomain(this.viewModel.domainID);
    let notes = domain.notes.filter(note => {
      return note.object_refs.includes(this.technique.id);
    });
    return notes.length > 0;
  }
  // sort and filter techniques
  public applyControls(techniques: Technique[], tactic: Tactic): Technique[] {
    return this.viewModel.applyControls(techniques, tactic, this.matrix)
  }

  // events to pass to parent component
  public onMouseEnter() {
    this.highlight.emit();
  }
  public onMouseLeave() {
    this.unhighlight.emit();
  }
  public onLeftClick(event) {
    if (this.configService.getFeature("selecting_techniques")) this.leftclick.emit({
      "technique": this.technique,
      // modifier keys
      "shift": event.shiftKey,
      "ctrl": event.ctrlKey,
      "meta": event.metaKey,
      // position of event on page
      "x": event.pageX,
      "y": event.pageY
    });
    else this.onRightClick(event);
  }
  public onRightClick(event) {
    this.showContextmenu = true;
  }
   /**
     * Get most readable text color for the given technique
     * @param  technique     the technique to get the text color for
     * @param  antihighlight boolean, true if the column is not selected.
     * @return               black, white, or gray, depending on technique and column state
     */
    public getTechniqueTextColor() {
      let tvm = this.viewModel.getTechniqueVM(this.technique, this.tactic)
      if (!tvm.enabled) return "#aaaaaa";
      // don't display if disabled or highlighted
      // if (this.viewModel.highlightedTechnique && this.viewModel.highlightedTechnique.technique_tactic_union_id == this.technique.technique_tactic_union_id) return "black"
      if (tvm.color) return tinycolor.mostReadable(tvm.color, ["white", "black"]);
      if (this.viewModel.layout.showAggregateScores && tvm.aggregateScoreColor) return tinycolor.mostReadable(tvm.aggregateScoreColor, ["white", "black"]);
      if (tvm.score && !isNaN(Number(tvm.score))) return tinycolor.mostReadable(tvm.scoreColor, ["white", "black"]);
      else return "black"
  }

}
