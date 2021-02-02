///
/// Copyright 2016-2020 University of Piraeus Research Center
/// <p>
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// <p>
///     http://www.apache.org/licenses/LICENSE-2.0
/// <p>
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import {Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {DataService} from '../services/data.service';
import {FormGroup, NgForm} from '@angular/forms';
import {FormUtilService} from '../services/form-util.service';
import {ValidationService} from '../services/validation.service';
import {BaseStep} from '../base/base-step';
import {WizardSteps} from '../base/wizard-steps.enum';
import {ExportType} from '../export/export-type.enum';
import {UtilitiesService} from '../services/utilities.service';
import {ApicallService} from '../services/apicall.service';

@Component({
  selector: 'app-finish-eo',
  templateUrl: './finish-eo.component.html',
  styleUrls: ['./finish-eo.component.css']
})
export class FinishEoComponent implements OnInit, BaseStep {

  @ViewChildren('form') forms: QueryList<NgForm>;
  @ViewChild('dateInput') dateInput: NgForm;

  @Input() form: FormGroup;
  @Input() startStepValid: boolean;
  @Input() procedureStepValid: boolean;
  @Input() exclusionStepValid: boolean;
  @Input() selectionStepValid: boolean;
  @Input() finishStepValid: boolean;


  constructor(
    public dataService: DataService,
    private formUtil: FormUtilService,
    private validationService: ValidationService,
    public utilities: UtilitiesService,
    public APIService: ApicallService
  ) {
  }

  ngOnInit() {

  }

  onHtmlExport() {
    this.dataService.finishEOSubmit(ExportType.HTML);
  }

  onPdfExport() {
    this.dataService.finishEOSubmit(ExportType.PDF);
  }

  getWizardStep(): WizardSteps {
    return WizardSteps.FINISH;
  }

  onXmlExport() {
    this.dataService.finishEOSubmit(ExportType.XML);
  }

  public areFormsValid(): boolean {
    return this.validationService.validateFormsInComponent(this.forms) && this.validationService.validateForm(this.dateInput);
  }

  isExportPossible(): boolean {
    return this.startStepValid && this.procedureStepValid && this.exclusionStepValid && this.selectionStepValid && this.finishStepValid && !this.dateInput.invalid;
  }
}
