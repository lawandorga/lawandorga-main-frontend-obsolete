import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipAutocompleteComponent } from './components/chip-autocomplete/chip-autocomplete.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { DynamicInputComponent } from './components/dynamic-input/dynamic-input.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { EditTextComponent } from './components/edit-text/edit-text.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormDialogComponent } from './components/form-dialog/form-dialog.component';
import { SharedSandboxService } from './services/shared-sandbox.service';
import { SafeHtmlPipe } from './pipes/safe-html';

@NgModule({
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, NgxChartsModule],
  declarations: [
    SafeHtmlPipe,
    ChipAutocompleteComponent,
    AutocompleteComponent,
    DynamicFormComponent,
    DynamicInputComponent,
    EditTextComponent,
    ConfirmationDialogComponent,
    FormDialogComponent,
  ],
  exports: [
    SafeHtmlPipe,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    DynamicInputComponent,
    DynamicFormComponent,
    FormDialogComponent,
    ChipAutocompleteComponent,
    AutocompleteComponent,
    ReactiveFormsModule,
    EditTextComponent,
    ConfirmationDialogComponent,
  ],
  providers: [SharedSandboxService],
})
export class SharedModule {}
