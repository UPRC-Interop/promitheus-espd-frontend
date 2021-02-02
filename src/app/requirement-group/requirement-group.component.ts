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

import {Component, Input, OnChanges, OnInit, ChangeDetectorRef} from '@angular/core';
import {RequirementGroup} from '../model/requirementGroup.model';
import {FormGroup} from '@angular/forms';
import {FormUtilService} from '../services/form-util.service';
import {UUID} from 'angular2-uuid';
import {UtilitiesService} from '../services/utilities.service';

@Component({
  selector: 'app-requirement-group',
  templateUrl: './requirement-group.component.html',
  styleUrls: ['./requirement-group.component.css']
})
export class RequirementGroupComponent implements OnInit, OnChanges {

  @Input() reqGroup: RequirementGroup;
  @Input() form: FormGroup;
  @Input() indicator: boolean;
  public childIndicator: boolean;
  public placeHolder: any = {};

  public showIndicator: boolean;

  constructor(public formUtil: FormUtilService, public utilities: UtilitiesService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngOnChanges() {

    setTimeout(() => {
      this.showIndicator = this.checkIndicator(this.indicator);
      if (!this.cdr['destroyed']) {
        this.cdr.detectChanges();
      }
    });

  }

  // console.log('Check Indicator called ' + this.reqGroup.id + ' with value of indicator: ' + this.indicator);

  checkIndicator(indicatorState: boolean): boolean {
    // console.log(this.reqGroup.condition === 'ONTRUE');
    if (this.reqGroup.condition) {
      // console.log(this.reqGroup.condition === 'ONFALSE');
      if (this.reqGroup.condition.endsWith('ON_FALSE') || this.reqGroup.condition === 'ONFALSE') {
        this.setFormState(!indicatorState);
        return !indicatorState;
      } else {
        this.setFormState(indicatorState);
        return indicatorState;
      }
    }
    return true;
  }

  private setFormState(state: boolean) {
    if (!state) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  childIndicatorChangedHandler(event: boolean) {
    this.childIndicator = (event);
  }

  onAdd(rg: RequirementGroup, i: number) {
    // console.log(`Called onAdd with groupId ${rg.uuid}:`);
    // console.log(this.formUtil.template[rg.uuid]);

    if (this.formUtil.template[rg.uuid] !== undefined) {

      // create new formGroup from template
      const fg = this.formUtil.createTemplateFormGroup(rg.uuid);
      console.log('The Requirement Group created from the Template:');
      console.log(fg);

      // console.log('THIS IS TEST WHETHER THERE IS REQUIREMENT OR NOT');
      // console.log(this.utilities.CAReqExists(this.formUtil.template[rg.uuid]));

      // push to json Structure

      // Overwrite FIX: don't assign by reference.
      this.placeHolder = JSON.parse(JSON.stringify(this.formUtil.template[rg.uuid]));
      // TODO: generate uuid
      let uuid = UUID.UUID();
      this.placeHolder.uuid = uuid;
//      this.formUtil.pushToReqGroups(this.reqGroup, this.placeHolder);
      console.log('Local ReqGroup:');
      console.log(this.reqGroup);
      console.log('new ReqGroup:');
      console.log(this.placeHolder);

      // change requirement ids
      this.formUtil.changeReqId(this.placeHolder);

      // this.reqGroup.requirementGroups.push(this.placeHolder);
      this.reqGroup.requirementGroups.splice(i + 1, 0, this.placeHolder);
      console.log('NEW Local ReqGroup:');
      console.log(this.reqGroup);
      // add formGroup to Form object
      console.log('FORM before add: ');
      console.log(this.form);
      console.log(`Adding new control with id:${uuid}`);
      this.form.addControl(uuid, fg);
      console.log('FORM After ADD: ');
      console.log(this.form);

      this.formUtil.getReqGroups(this.placeHolder);

    } else {
      console.log('No template found for criteria creation');
    }
  }

  onRemove(reqGroup: RequirementGroup) {
    console.log('First remove the model, since this is where the iteration depends');
    this.reqGroup.requirementGroups = this.reqGroup.requirementGroups.filter(rg => rg !== reqGroup);

    console.log('Removing the Form Requirement Group');
    console.log(this.form);
    this.form.removeControl(reqGroup.uuid);
  }


}
