import { Component, OnInit, Input } from '@angular/core';
import { Technique, Tactic } from '../../../shared/services/data.service';
import { ViewModel } from '../../../shared/services/viewmodels.service';

@Component({
  selector: 'tactic-cell',
  templateUrl: './tactic-cell.component.html',
  styleUrls: ['./tactic-cell.component.scss']
})
export class TacticCellComponent implements OnInit {
  @Input() tactic: Tactic;
  @Input() viewModel: ViewModel;
  constructor() { }

  ngOnInit(): void {
  }

}
