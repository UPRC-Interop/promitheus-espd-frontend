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
import {ApicallService} from '../services/apicall.service';
import {UtilitiesService} from '../services/utilities.service';
import {CodeList} from '../model/codeList.model';
import {CodelistService} from '../services/codelist.service';
import {ValidationService} from '../services/validation.service';
import {BaseStep} from '../base/base-step';
import {WizardSteps} from '../base/wizard-steps.enum';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit, BaseStep {

  @ViewChildren('form') forms: QueryList<NgForm>;
  weightingType: CodeList[] = null;


  constructor(public dataService: DataService,
              public APIService: ApicallService,
              public utilities: UtilitiesService,
              public codelist: CodelistService,
              private validationService: ValidationService) {
  }

  ngOnInit() {

    if (this.dataService.isReadOnly() || this.utilities.qualificationApplicationType === 'selfcontained') {
      this.utilities.isAtoD = true;
      this.utilities.isSatisfiedALL = false;
    }
    console.log(this.dataService.CADetails);
  }


  handleALL(radio: FormControl) {
    // console.dir(typeof(radio.value));
    if (radio.value === 'YES') {
      this.utilities.isSatisfiedALL = false;
      this.utilities.isAtoD = true;
      // console.log("This is CA: "+this.isCA);
      // console.log("This is EO: "+this.isEO);
    } else if (radio.value === 'NO') {
      this.utilities.isSatisfiedALL = true;
      this.utilities.isAtoD = false;

      if (this.utilities.isCA && this.utilities.isImportReq) {
        if (this.APIService.version === 'v2') {
          this.utilities.getSatisfiesALLCriterion(this.dataService.selectionALLCriteria, 'f4dc58dd-af45-4602-a4c8-3dca30fac082').selected = true;
        } else if (this.APIService.version === 'v1') {
          this.utilities.getSatisfiesALLCriterion(this.dataService.selectionALLCriteria, '7e7db838-eeac-46d9-ab39-42927486f22d').selected = true;
        }

      }

    }
  }

  handleGlobalWeight(radio: FormControl) {
    if (radio.value === 'YES') {
      this.utilities.isGloballyWeighted = true;
    } else if (radio.value === 'NO') {
      this.utilities.isGloballyWeighted = false;
    }
  }

  onSelectionSubmit(form: NgForm) {
    console.log(form.value);
  }

  getWizardStep(): WizardSteps {
    return WizardSteps.SELECTION;
  }

  public areFormsValid(): boolean {
    return this.utilities.isSatisfiedALL ? true : this.validationService.validateFormsInComponent(this.forms);
  }
}
