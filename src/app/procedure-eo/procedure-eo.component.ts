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

import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {DataService} from '../services/data.service';
// import {ProcedureType} from '../model/procedureType.model';
// import {Country} from '../model/country.model';
import {FormArray, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatChipInputEvent, MatDialog} from '@angular/material';
import {UtilitiesService} from '../services/utilities.service';
import {COMMA, ENTER} from '../../../node_modules/@angular/cdk/keycodes';
import {CodelistService} from '../services/codelist.service';
import {ValidationService} from '../services/validation.service';
import {BaseStep} from '../base/base-step';
import {WizardSteps} from '../base/wizard-steps.enum';
import {UrlValidation} from '../validation/url/url-validation';
import {ApicallService} from '../services/apicall.service';

@Component({
  selector: 'app-procedure-eo',
  templateUrl: './procedure-eo.component.html',
  styleUrls: ['./procedure-eo.component.css']
})
export class ProcedureEoComponent implements OnInit, BaseStep {

  @ViewChildren('form') forms: QueryList<NgForm>;
  @ViewChild('ojs') ojsForm: NgForm;

  // public EOForm: FormGroup;

  /* CPV chips */
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  disabled = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  constructor(public dataService: DataService,
              public dialog: MatDialog, public utilities: UtilitiesService,
              private validationService: ValidationService,
              public codelist: CodelistService, public APIService: ApicallService) {
    this.dataService.EOForm = new FormGroup({
      'name': new FormControl(this.dataService.EODetails.name),
      'smeIndicator': new FormControl(false),
      'employeeQuantity': new FormControl(),
      'eoRole': new FormControl(),
      'generalTurnover': new FormGroup({
        'amount': new FormControl(),
        'currency': new FormControl()
      }),
      'postalAddress': new FormGroup({
        'addressLine1': new FormControl(),
        'postCode': new FormControl(),
        'city': new FormControl(),
        'countryCode': new FormControl(this.dataService.selectedEOCountry),
      }),
      'contactingDetails': new FormGroup({
        'contactPointName': new FormControl(),
        'emailAddress': new FormControl(null, [Validators.email]),
        'faxNumber': new FormControl(),
        'telephoneNumber': new FormControl(),
      }),
      'naturalPersons': new FormArray([this.initNaturalPerson()]),
      'id': new FormControl(),
      'webSiteURI': new FormControl(null, [UrlValidation]),
      'procurementProjectLot': new FormControl(0)
    });
    this.dataService.EOForm = this.dataService.EOForm;

  }

  ngOnInit() {

    // make EODetails and Natural Person forms non editable if user selects review ESPD
    if (this.dataService.isReadOnly()) {
      this.dataService.EOForm.disable();
    }

    /* Make Chips non editable when user is EO and is requirement, or when the artefact is being reviewed */
    if (this.dataService.isReadOnly()) {
      this.disabled = true;
      this.removable = false;
    }

    /* OTHER_EO_LOT TENDERED CRITERION lot generation */
    this.utilities.projectLots = this.utilities.createLotList(this.dataService.CADetails.procurementProjectLots);

  }

  getWizardStep(): WizardSteps {
    return WizardSteps.PROCEDURE;
  }

  public areFormsValid(): boolean {
    return this.validationService.validateFormsInComponent(this.forms) && this.validationService.validateForm(this.ojsForm);
  }

  /* ================================================= natural person form ================================================ */

  initNaturalPerson() {
    return new FormGroup({
      'firstName': new FormControl(),
      'familyName': new FormControl(),
      'role': new FormControl(),
      'birthPlace': new FormControl(),
      'birthDate': new FormControl(),
      'postalAddress': new FormGroup({
        'addressLine1': new FormControl(),
        'postCode': new FormControl(),
        'city': new FormControl(),
        'countryCode': new FormControl(),
      }),
      'contactDetails': new FormGroup({
        'contactPointName': new FormControl(),
        'emailAddress': new FormControl(null, [Validators.email]),
        'telephoneNumber': new FormControl(),
      })
    });
  }

  addPerson() {
    const control = <FormArray>this.dataService.EOForm.controls['naturalPersons'];
    control.push(this.initNaturalPerson());
  }

  removePerson(i: number) {
    const control = <FormArray>this.dataService.EOForm.controls['naturalPersons'];
    control.removeAt(i);
  }

  getNaturalPersonFormData() {
    return <FormArray>this.dataService.EOForm.controls['naturalPersons'];
  }


  /* ====================================================== Getting values from Form ======================================*/


  onProcedureEOSubmit(form: NgForm, eoForm: FormGroup) {
    // console.log('NATURAL PERSON formData: ');
    // console.log(this.EOForm.controls['naturalPersons']);
    // console.log(this.getNaturalPersonFormData());


    this.dataService.CADetails.cacountry = this.dataService.selectedCountry;
    // this.dataService.CADetails.receivedNoticeNumber = form.value.receivedNoticeNumber;
    this.dataService.PostalAddress.countryCode = this.dataService.selectedCountry;
    this.dataService.CADetails.postalAddress = this.dataService.PostalAddress;
    this.dataService.CADetails.contactingDetails = this.dataService.ContactingDetails;

    console.log(this.dataService.selectedEOCountry);

    console.log(this.dataService.CADetails);
    this.dataService.EODetails = eoForm.value;
    console.log(this.dataService.EODetails);
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

}
