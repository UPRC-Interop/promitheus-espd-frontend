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

import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DataService} from '../services/data.service';
import {NgForm} from '@angular/forms';
import {ValidationService} from '../services/validation.service';
import {BaseStep} from '../base/base-step';
import {WizardSteps} from '../base/wizard-steps.enum';
import {ExportType} from '../export/export-type.enum';
import {UtilitiesService} from '../services/utilities.service';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.css']
})
export class FinishComponent implements OnInit, BaseStep {

  @ViewChildren('form') forms: QueryList<NgForm>;

  @Input() startStepValid: boolean;
  @Input() procedureStepValid: boolean;
  @Input() exclusionStepValid: boolean;
  @Input() selectionStepValid: boolean;
  @Input() finishStepValid: boolean;

  constructor(
    public dataService: DataService,
    private validationService: ValidationService,
    public utilities: UtilitiesService
  ) {
  }

  ngOnInit() {
  }

  exportHtmlFile() {
    this.dataService.finishSubmit(ExportType.HTML);
  }

  exportPdfFile() {
    this.dataService.finishSubmit(ExportType.PDF);
  }

  exportXmlFile() {
    this.dataService.finishSubmit(ExportType.XML);
  }

  getWizardStep(): WizardSteps {
    return WizardSteps.FINISH;
  }

  public areFormsValid(): boolean {
    return this.validationService.validateFormsInComponent(this.forms);
  }

  isExportPossible(): boolean {
    return this.startStepValid && this.procedureStepValid && this.exclusionStepValid && this.selectionStepValid
      && this.finishStepValid;
  }
}
