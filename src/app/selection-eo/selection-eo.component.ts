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

import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DataService} from '../services/data.service';
import {FormControl, NgForm} from '@angular/forms';
import {ValidationService} from '../services/validation.service';
import {BaseStep} from '../base/base-step';
import {WizardSteps} from '../base/wizard-steps.enum';
import {UtilitiesService} from '../services/utilities.service';
import {CodelistService} from '../services/codelist.service';

@Component({
  selector: 'app-selection-eo',
  templateUrl: './selection-eo.component.html',
  styleUrls: ['./selection-eo.component.css']
})
export class SelectionEoComponent implements OnInit, BaseStep {

  @ViewChildren('form') forms: QueryList<NgForm>;

  constructor(
    public dataService: DataService,
    public utilities: UtilitiesService,
    private validationService: ValidationService,
    public codelist: CodelistService
  ) {
  }

  ngOnInit() {
    if (this.dataService.isReadOnly() || this.utilities.qualificationApplicationType === 'selfcontained') {
      this.utilities.isAtoD = true;
      this.utilities.isSatisfiedALL = false;
    }
    /* GES - 82 make yes as default answer*/
    if (this.dataService.isReadOnly() || this.utilities.qualificationApplicationType === 'regulated') {
      this.utilities.isAtoD = true;
      this.utilities.isSatisfiedALL = false;
    }
  }

  handleALL(radio: FormControl) {
    if (radio.value === 'YES') {
      this.utilities.isSatisfiedALL = false;
      this.utilities.isAtoD = true;
    } else if (radio.value === 'NO') {
      this.utilities.isSatisfiedALL = true;
      this.utilities.isAtoD = false;
    }
  }

  handleGlobalWeight(radio: FormControl) {
    if (radio.value === 'YES') {
      this.utilities.isGloballyWeighted = true;
    } else if (radio.value === 'NO') {
      this.utilities.isGloballyWeighted = false;
    }
  }


  // onSelectionEOSubmit() {
  //   this.dataService.selectionEOSubmit(this.utilities.isSatisfiedALL);
  // }

  getWizardStep(): WizardSteps {
    return WizardSteps.SELECTION;
  }

  public areFormsValid(): boolean {
    return this.validationService.validateFormsInComponent(this.forms);
  }
}
