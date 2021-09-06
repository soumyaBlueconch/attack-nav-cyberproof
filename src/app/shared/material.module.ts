import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';

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
    MatTooltipModule,
    MatButtonModule
  ],
  exports:[
    MatSliderModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCheckboxModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatButtonModule
  ]
})
export class MaterialModule { }
