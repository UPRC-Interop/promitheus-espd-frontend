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

import {Component, Input, OnInit} from '@angular/core';
import {ExclusionCriteria} from '../model/exclusionCriteria.model';
import {FormGroup} from '@angular/forms';
import {RequirementGroup} from '../model/requirementGroup.model';
import {FormUtilService} from '../services/form-util.service';
import {UUID} from 'angular2-uuid';
import {FullCriterion} from '../model/fullCriterion.model';
import {UtilitiesService} from '../services/utilities.service';

@Component({
  selector: 'app-criterion',
  templateUrl: './criterion.component.html',
  styleUrls: ['./criterion.component.css']
})
export class CriterionComponent implements OnInit {

  @Input() criterion: ExclusionCriteria;
  @Input() form: FormGroup;
  @Input() indicator: boolean;
  public placeHolder: any = {};
  fullCriterionList: FullCriterion[] = null;

  constructor(public formUtil: FormUtilService, public utilities: UtilitiesService) {
  }

  ngOnInit() {
    this.form = this.form[this.criterion.uuid];
  }

  onAdd(reqGroup: RequirementGroup, i: number) {
    // console.log(`Called onAdd with groupId ${reqGroup.uuid}:`);
    // console.log(this.formUtil.template[reqGroup.uuid]);

    if (this.formUtil.template[reqGroup.uuid] !== undefined) {

// create new formGroup from template
      const fg = this.formUtil.createTemplateFormGroup(reqGroup.uuid);
      console.log('The Requirement Group created from the Template: ');
      console.log(fg);

      // console.log('THIS IS TEST WHETHER THERE IS REQUIREMENT OR NOT');
      // console.log(this.utilities.CAReqExists(this.formUtil.template[reqGroup.uuid]));

// push to json Structure

// Overwrite FIX: don't assign by reference.
      this.placeHolder = JSON.parse(JSON.stringify(this.formUtil.template[reqGroup.uuid]));
// TODO: generate uuid
      let uuid = UUID.UUID();
      this.placeHolder.uuid = uuid;
// this.formUtil.pushToReqGroups(this.reqGroup, this.placeHolder);
      console.log('Local ReqGroup:');
      console.log(reqGroup);
      console.log('new ReqGroup:');
      console.log(this.placeHolder);

      // change requirement ids
      this.formUtil.changeReqId(this.placeHolder);


      // this.criterion.requirementGroups.push(this.placeHolder);
      this.criterion.requirementGroups.splice(i + 1, 0, this.placeHolder);
      console.log('NEW Local ReqGroup:');
      console.log(reqGroup);
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
    this.criterion.requirementGroups = this.criterion.requirementGroups.filter(rg => rg !== reqGroup);

    console.log('Removing the Form Requirement Group');
    console.log(this.form);
    this.form.removeControl(reqGroup.uuid);
  }

}
