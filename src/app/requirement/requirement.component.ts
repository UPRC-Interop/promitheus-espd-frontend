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

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Requirement} from '../model/requirement.model';
import {DataService} from '../services/data.service';
import {ApicallService} from '../services/apicall.service';
import {UtilitiesService} from '../services/utilities.service';
import {MatChipInputEvent, MatSelectionList} from '@angular/material';
import {COMMA, ENTER} from '../../../node_modules/@angular/cdk/keycodes';
import {CodeList} from '../model/codeList.model';
import {CodelistService} from '../services/codelist.service';


@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.css']
})
export class RequirementComponent implements OnInit, OnChanges {

  @Input() req: Requirement;
  @Input() form: FormGroup;

  @Output() indicatorChanged = new EventEmitter();
  // @Output() lotsInReq = new EventEmitter();

  eoIDType: CodeList[];
  currency: CodeList[];
  reqLots: string[] = [];
  cpvCodes: string[] = [];
  isWeighted = false;
  /* CPV chips */
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  disabled = false;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('lots') lots: MatSelectionList;


  constructor(public dataService: DataService,
              public APIService: ApicallService,
              public utilities: UtilitiesService,
              public codelist: CodelistService) {


  }

  ngOnChanges() {
    if (this.req.responseDataType === 'INDICATOR' || this.req.responseDataType === 'CODE_BOOLEAN') {
      this.indicatorChanged.emit(this.form.get(this.req.uuid).value);
    }
    // this.indicatorChanged.emit(this.form.get(this.req.uuid).value);

  }

  ngOnInit() {

    if ((this.req.type === 'REQUIREMENT' && this.utilities.isImport() && this.utilities.isEO) || this.utilities.isReviewESPD) {
      this.form.get(this.req.uuid).disable();
      if (this.req.responseDataType === 'WEIGHT_INDICATOR') {
        this.form.get(this.req.uuid + 'weight').disable();
        this.form.get(this.req.uuid + 'evaluationMethodDescription').disable();
      } else if (this.req.responseDataType === 'AMOUNT') {
        this.form.get(this.req.uuid + 'currency').disable();
      } else if (this.req.responseDataType === 'PERIOD' && this.APIService.version === 'v2') {
        this.form.get(this.req.uuid + 'startDate').disable();
        this.form.get(this.req.uuid + 'endDate').disable();
      } else if (this.req.responseDataType === 'ECONOMIC_OPERATOR_IDENTIFIER') {
        this.form.get(this.req.uuid + 'eoidtype').disable();
      } else if (this.req.responseDataType === 'EVIDENCE_IDENTIFIER') {
        this.form.get(this.req.uuid + 'evidenceUrl').disable();
        this.form.get(this.req.uuid + 'evidenceCode').disable();
        this.form.get(this.req.uuid + 'evidenceIssuer').disable();
      }
    }

    /*======================= ESPD-114 JIRA issue FIX ========================== */
    if (this.req.responseDataType === 'AMOUNT' && this.utilities.isImport()) {
       const tempValue = this.utilities.amountTransformReverse(this.form.get(this.req.uuid).value.toString());
      this.form.get(this.req.uuid).patchValue(tempValue);
    }

    if (this.req.responseDataType === 'WEIGHT_INDICATOR' && this.utilities.isImport()) {
      this.isWeighted = this.utilities.criterionWeightIndicators[this.req.uuid];
    }


    if (this.req.responseDataType === 'CODE' && this.req.responseValuesRelatedArtefact === 'CPVCodes' && this.utilities.isImport()) {
      // init cpvCodes when import
      this.cpvCodes = this.utilities.renderCpvTemplate[this.req.uuid];

      /* Make Chips non editable when user is EO and is requirement, or when the artefact is being reviewed */
      if ((this.utilities.isEO && this.req.type === 'REQUIREMENT') || this.utilities.isReviewESPD) {
        this.disabled = true;
        this.removable = false;
      }
      /* make cpvTemplate with chips that are pre-existing at the imported artifact */
      if (this.cpvCodes !== undefined) {
        this.utilities.cpvTemplate[this.req.uuid] = this.utilities.cpvCodeToString(this.cpvCodes);
      }
    }

    if (this.req.responseDataType === 'INDICATOR' || this.req.responseDataType === 'CODE_BOOLEAN') {
      this.form.get(this.req.uuid)
        .valueChanges
        .subscribe(ev => {
          this.indicatorChanged.emit(ev);
        });
    } else {
      this.indicatorChanged.emit(true);
    }


    /* SELF-CONTAINED: WEIGHT_INDICATOR */
    if (this.req.responseDataType === 'WEIGHT_INDICATOR') {
      this.form.get(this.req.uuid)
        .valueChanges
        .subscribe(ev => {
          console.log('emit weight: ' + ev);
          // console.log(ev);
          this.isWeighted = ev;
          console.log(this.isWeighted);
          // console.log(typeof ev);
          // this.indicatorChanged.emit(ev);
        });
    }
  }


  /* SELF-CONTAINED: CODE with CPVCodes as responseValuesRelatedArtefact */
  createChips() {
    this.utilities.cpvTemplate[this.req.uuid] = this.utilities.cpvCodeToString(this.cpvCodes);
    console.log(this.utilities.cpvTemplate);
    // console.log(this.utilities.cpvTemplate['0157cebc-4ba4-4d65-9a6e-3cd5d57a08fb-34']);
  }

  /* CPV Chip handling */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our cpv
    if ((value || '').trim()) {
      if (this.cpvCodes !== null && this.cpvCodes !== undefined) {
        this.cpvCodes.push(value.trim());
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.createChips();
  }

  remove(cpv: string): void {
    const index = this.cpvCodes.indexOf(cpv);

    if (index >= 0) {
      this.cpvCodes.splice(index, 1);
    }
    /* re-create chip template when chips are removed */
    this.createChips();
  }

  onNgModelChange(event: Event) {
    console.log('MODEL CHANGE for req.uuid: ' + this.req.uuid);
    console.log(this.utilities.renderLotTemplate[this.req.uuid]);
  }
}
