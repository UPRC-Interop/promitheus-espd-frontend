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

import {Component, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren} from '@angular/core';
import {DataService} from '../services/data.service';
import {UtilitiesService} from '../services/utilities.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {CodelistService} from '../services/codelist.service';
import {NgForm} from '@angular/forms';
import {ValidationService} from '../services/validation.service';
import {BaseStep} from '../base/base-step';
import {WizardSteps} from '../base/wizard-steps.enum';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.css']
})
export class ProcedureComponent implements OnInit, OnChanges, BaseStep {

  /* CPV chips */
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  disabled = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChildren('form') forms: QueryList<NgForm>;
  @ViewChild('form') form: NgForm;

  constructor(public dataService: DataService,
              public utilities: UtilitiesService,
              private validationService: ValidationService,
              public codelist: CodelistService) {
  }

  ngOnInit() {

    if (this.dataService.CADetails) {
      this.dataService.CADetails.classificationCodes = [];
    }

    /* Make Chips non editable when user is EO and is requirement, or when the artefact is being reviewed */
    if (this.dataService.isReadOnly()) {
      this.disabled = true;
      this.removable = false;
    }

    this.form.form.valueChanges.subscribe(x => {
      /* SELF-CONTAINED: Set isDividedIntoLots boolean in order to show/hide the OTHER_CA lots criterion */
      if (x.procurementProjectLots !== undefined) {
        if (parseInt(x.procurementProjectLots, 10) === 0 || parseInt(x.procurementProjectLots, 10) === 1) {
          this.utilities.isDividedIntoLots = false;
          // console.log(this.utilities.isDividedIntoLots);
        } else {
          this.utilities.isDividedIntoLots = true;
          this.utilities.projectLots = this.utilities.createLotList(x.procurementProjectLots);
          // console.log(this.utilities.isDividedIntoLots);
        }
      }
    });

  }


  ngOnChanges(changes: SimpleChanges) {
  }


  onProcedureSubmit(form: NgForm) {
    // console.log(form.value);
    this.dataService.CADetails.cacountry = form.value.CACountry;
    this.dataService.CADetails.receivedNoticeNumber = form.value.receivedNoticeNumber;
    // this.dataService.CADetails.postalAddress.countryCode = form.value.CACountry;
    this.dataService.PostalAddress.countryCode = form.value.CACountry;
    this.dataService.CADetails.postalAddress = this.dataService.PostalAddress;
    this.dataService.CADetails.contactingDetails = this.dataService.ContactingDetails;
    console.log(this.dataService.CADetails);
    // this.dataService.procedureSubmit(this.eoRelatedCriteria, this.reductionCriteria);
  }

  getWizardStep(): WizardSteps {
    return WizardSteps.PROCEDURE;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;


    // Add our cpv
    if ((value || '').trim()) {
      this.dataService.CADetails.classificationCodes.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(cpv: string): void {
    const index = this.dataService.CADetails.classificationCodes.indexOf(cpv);

    if (index >= 0) {
      this.dataService.CADetails.classificationCodes.splice(index, 1);
    }
  }


  public areFormsValid(): boolean {
    return this.validationService.validateFormsInComponent(this.forms);
  }
}
