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

import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';
import {SelectionCriteria} from '../model/selectionCriteria.model';
import {MatListOption, MatSnackBar} from '@angular/material';
import {RequirementGroup} from '../model/requirementGroup.model';
import {FullCriterion} from '../model/fullCriterion.model';
import {ReductionCriterion} from '../model/reductionCriterion.model';
import {ErrorResponse} from '../model/error-response';


@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  isCA = false;
  isEO = false;
  isImportESPD = false;
  isImportReq = false;
  isCreateResponse = false;
  isCreateNewESPD = false;
  isReviewESPD = false;
  initLanguage = true;
  start = false;
  isReset = false;
  isStarted = false;
  satisfiedALLCriterionExists = false;
  isSatisfiedALL = false;
  isAtoD = false;
  isSatisfiedALLSelected = false;
  qualificationApplicationType: string;
  isGloballyWeighted = false;
  isDividedIntoLots = false;
  projectLots = [];
  lotTemplate = [];
  cpvTemplate = [];
  renderCpvTemplate = [];
  criterionWeightIndicators = [];
  renderLotTemplate = [];
  cpvString = [];
  type: string;
  selectedLang = 'en';
  eCertisTemplate = [];
  elLogo = 'el_horizontal_cef_logo.png';
  enLogo = 'en_horizontal_cef_logo_2.png';
  logo = 'el_horizontal_cef_logo.png';

  /* GES-2 Fixing reduction of candidates v1 rendering and default answer YES at v2 */
  reductionUUID: string;

  /* UX feedback to the user when artifacts are being exported */
  isLoading = false;

  role: string;
  // qualificationApplicationType = 'SELF-CONTAINED';
  // qualificationApplicationType = 'REGULATED';


  constructor(public snackBar: MatSnackBar) {
  }

  /*  ======================================== Date Manipulation ================================*/

  toUTCDate(date: Moment): Moment {
    if (date !== null && date !== undefined) {
      const utcDate = new Date(Date.UTC(date.toDate().getFullYear(),
        date.toDate().getMonth(),
        date.toDate().getDate(),
        date.toDate().getHours(),
        date.toDate().getMinutes()));

      return moment(utcDate);
    }
  }

  isEmpty(obj: Object): Boolean {
    // console.log(Object.keys(obj).length);
    if (Object.keys(obj).length === 0) {
      return true;
    } else {
      return false;
    }
  }

  isEmptyStringArray(arr: string[]): Boolean {
    return arr.every(item => item.trim() === '');
  }

  findCriterion(criteria: SelectionCriteria[], id: string): boolean {

    const criterionFound = criteria.find((cr) => {
      return cr.id === id;
    });

    if (criterionFound) {
      return true;
    } else if (criterionFound === undefined) {
      return false;
    }

  }

  isImportandReductionExists(criteria: ReductionCriterion[], id: string): boolean {
    if (this.isImport() && this.findCriterion(criteria, id)) {
      return true;
    } else {
      return false;
    }
  }


  getSatisfiesALLCriterion(criteria: SelectionCriteria[], id: string): SelectionCriteria {
    return criteria.find((cr) => {
      return cr.id === id;
    });
  }

  getCriterion(criteria: SelectionCriteria[], id: string): SelectionCriteria {
    return criteria.find((cr) => {
      return cr.id === id;
    });
  }

  isCriterionSelected(criteria: SelectionCriteria[], id: string): boolean {
    if (this.getCriterion(criteria, id) !== undefined) {
      return this.getCriterion(criteria, id).selected;
    } else {
      return false;
    }
  }

  setAllFields(obj: Object, val: any) {
    Object.keys(obj).forEach(function (k) {
      obj[k] = val;
    });
  }

  createLotList(lots: number): string[] {
    const projectLotsList = [];
    for (let i = 1; i <= lots; i++) {
      projectLotsList.push('Lot' + i);
    }

    // console.log(projectLotsList);

    return projectLotsList;
  }

  createLotListInCriterion(lots: MatListOption[]): string[] {
    const reqLot = lots.map(lot => {
      return lot.value;
    });
    return reqLot;
    // console.log(reqLot);
  }

  cpvCodeToString(cpvs: string[]): string {
    return cpvs.join(',');
  }

  stringToCpvCode(cpvString: string): string[] {
    return cpvString.split(',');
  }

  isImport(): boolean {
    return this.isImportReq || this.isImportESPD || this.isReviewESPD;
  }

  CAReqExists(rg: RequirementGroup): boolean {
    let result: boolean;
    if (rg) {
      if (rg.requirements !== undefined) {
        result = rg.requirements.some(req => {
          return req.type === 'REQUIREMENT';
        });
      }
    }

    if (rg.requirementGroups != null || rg.requirementGroups != undefined) {
      rg.requirementGroups.forEach(rg => {
        // console.log('Req Group ' + rg.uuid);
        this.CAReqExists(rg);
      });
    }


    if (result) {
      return true;
    } else if (result === undefined) {
      return false;
    }
  }

  // makeDummyESPDRequest(): ESPDRequest {
  //   const json = JSON.parse(this.requestJSON);
  //   return new ESPDRequest(json.cadetails, json.fullCriterionList, json.documentDetails);
  // }

  /* Show/hide eCertis criteria and related buttons */

  createShowECertisTemplate(criteria: FullCriterion[]) {
    criteria.forEach(cr => {
      this.eCertisTemplate[cr.id] = false;
    });
  }

  toggleECertis(id: string) {
    this.eCertisTemplate[id] = !this.eCertisTemplate[id];
  }

  resetSubCriterionList(criteria: FullCriterion[]) {
    criteria.forEach(cr => {
      if (cr.subCriterionList.length > 0) {
        cr.subCriterionList.length = 0;
        this.eCertisTemplate[cr.id] = false;
      }
    });
  }


  /* ============================ snackbar ===================================== */
  openSnackBar(error: ErrorResponse, action: string) {
    let message: string;
    if (error.message != null) {
      message = error.message;
    } else {
      message = 'Connection to the backend server could not be established';
    }
    this.snackBar.open(message, action);
  }

  setLogo(lang: string) {
    this.logo = (lang === 'el' ? this.elLogo : this.enLogo);
  }

  /* ========================= ESPD-141 Amount Decimal fix =================== */

  amountTransform(amount: any): any {
    return amount.replace(/,/g, '.');
  }

  amountTransformReverse(amount: any): any {
    return amount.replace(/\./g, ',');
  }

}
