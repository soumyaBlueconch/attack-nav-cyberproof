import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/shared/services/config.service';
import { MatrixCommon } from '../matrix-common';
@Component({
  selector: 'matrix-side',
  templateUrl: './matrix-side.component.html',
  styleUrls: ['./matrix-side.component.scss']
})
export class MatrixSideComponent extends MatrixCommon implements OnInit  {

  constructor(configService: ConfigService) {
    super(configService);
   }

  ngOnInit(): void {
  }

}
