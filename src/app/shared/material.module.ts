import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [],
  imports: [
    MatSliderModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCheckboxModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  exports:[
    MatSliderModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCheckboxModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ]
})
export class MaterialModule { }
