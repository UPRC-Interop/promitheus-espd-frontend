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
import {RequirementGroup} from '../model/requirementGroup.model';
import {EoRelatedCriterion} from '../model/eoRelatedCriterion.model';
import {FormControl, FormGroup} from '@angular/forms';
import {RequirementResponse} from '../model/requirement-response.model';
import {Evidence} from '../model/evidence.model';
import {EvidenceIssuer} from '../model/evidenceIssuer.model';
import * as moment from 'moment';
import {ApicallService} from './apicall.service';
import {ExclusionCriteria} from '../model/exclusionCriteria.model';
import {SelectionCriteria} from '../model/selectionCriteria.model';
import {ReductionCriterion} from '../model/reductionCriterion.model';
import {UtilitiesService} from './utilities.service';
import {FullCriterion} from '../model/fullCriterion.model';
import {UUID} from 'angular2-uuid';
import {CaRelatedCriterion} from '../model/caRelatedCriterion.model';
import {stringify} from 'querystring';
import {UrlValidation} from '../validation/url/url-validation';

@Injectable({
  providedIn: 'root'
})
export class FormUtilService {
  template = [];
  evidenceList: Evidence[] = [];


  constructor(private APIService: ApicallService,
              public utilities: UtilitiesService) {
  }

  createTemplateReqGroups(criteria: FullCriterion[]) {
    criteria.forEach(cr => {
      cr.requirementGroups.forEach(rg => {
        this.getReqGroups(rg);
      });
    });
  }

  getReqGroups(rg: RequirementGroup) {
    if (rg !== null || rg !== undefined) {

      this.template[rg.uuid] = rg;
      if (rg.requirementGroups !== null || rg.requirementGroups !== undefined) {
        rg.requirementGroups.forEach(rg2 => {
          this.getReqGroups(rg2);
        });
      }
    }
  }

  changeReqId(rg: RequirementGroup) {
    if (rg) {
      // change requirement ids
      if (rg.requirements !== undefined) {
        rg.requirements.forEach(r => {
          r.id = UUID.UUID();
          if (r.responseDataType === 'CODE' && r.responseValuesRelatedArtefact === 'CPVCodes') {
            r.uuid = r.id;
            this.utilities.renderCpvTemplate[r.uuid] = [];
          }
        });
      }
      if (rg.requirementGroups !== null || rg.requirementGroups !== undefined) {
        rg.requirementGroups.forEach(rg2 => {
          this.changeReqId(rg2);
        });
      }
    }

  }


  getFromForm(rg: RequirementGroup, cr: EoRelatedCriterion, form: FormGroup, formValues: any, evidenceList: Evidence[]) {

    if (rg != null || rg !== undefined) {
      // console.log('reqGroup ' + rg.uuid);

      if (rg.requirements !== undefined || rg.requirements != null) {

        rg.requirements.forEach(req => {
          if (req != null || req !== undefined) {
            // console.log('requirement uuid ' + req.uuid);
            // console.log(formValues[req.uuid.valueOf()]);
            if (req.response !== null) {
            } else {
              // console.log('RESPONSE IS NULL');
              req.response = new RequirementResponse();
            }
            // console.log(req.response);
            // req.response = new RequirementResponse();
            if (req.responseDataType === 'INDICATOR' || req.responseDataType === 'CODE_BOOLEAN') {
              if (formValues[req.uuid.valueOf()] === true) {
                req.response.indicator = true;
                req.response.uuid = null;
              } else {
                req.response.indicator = false;
                req.response.uuid = null;
              }
            } else if (req.responseDataType === 'WEIGHT_INDICATOR') {
              if (formValues[req.uuid.valueOf()] === true) {
                req.response.indicator = true;
                req.response.uuid = null;
                // req.response.evaluationMethodType = 'WEIGHTED';
              } else {
                req.response.indicator = false;
                req.response.uuid = null;
                // req.response.evaluationMethodType = 'PASSFAIL';
              }
              // const evaluationMethodTypeID = req.uuid + 'evaluationMethodType';
              const weightID = req.uuid + 'weight';
              const evaluationMethodDescriptionID = req.uuid + 'evaluationMethodDescription';

              /* REMOVED: evaluationMethodType dropdown, it's redundant since we have a YES/NO radio button that answers the question. */
              // if (formValues[evaluationMethodTypeID.valueOf()] === null) {
              //   req.response.evaluationMethodType = null;
              // } else {
              //   req.response.evaluationMethodType = formValues[evaluationMethodTypeID.valueOf()];
              // }


              /* IF user selects NO in the global weight radio button,
              then the 'weightable criteria's evaluationMethodType is set to PASSFAIL */
              if (!this.utilities.isGloballyWeighted) {
                // req.response.evaluationMethodType = 'PASSFAIL';
                req.response.indicator = false;
              }
              if (formValues[weightID.valueOf()] === null) {
                req.response.weight = null;
              } else {
                req.response.weight = formValues[weightID.valueOf()];
              }
              if (formValues[evaluationMethodDescriptionID.valueOf()] === null) {
                req.response.evaluationMethodDescription = null;
              } else {
                req.response.evaluationMethodDescription = formValues[evaluationMethodDescriptionID.valueOf()];
              }

            } else if (req.responseDataType === 'DESCRIPTION') {
              req.response.description = formValues[req.uuid.valueOf()];
              req.response.uuid = null;
            } else if (req.responseDataType === 'EVIDENCE_URL') {
              req.response.evidenceURL = formValues[req.uuid.valueOf()];
              req.response.uuid = null;
            } else if (req.responseDataType === 'EVIDENCE_IDENTIFIER') {
              // req.response.evidenceSuppliedId = formValues[req.uuid.valueOf()];
              // Workaround: if EvidenceURL is not present, do not create the evidence

              req.response.evidenceSuppliedId = req.id;
              req.response.validatedCriterionPropertyID = req.id;
              const evidenceUrlID = req.uuid + 'evidenceUrl';
              const evidenceCodeID = req.uuid + 'evidenceCode';
              const evidenceIssuerID = req.uuid + 'evidenceIssuer';
              if (formValues[evidenceUrlID.valueOf()] !== null) {
                // create evidence
                let evidence = new Evidence();
                let evidenceIssuer = new EvidenceIssuer();
                evidence.id = req.id;

                // fill in workaround
                if (formValues[evidenceUrlID.valueOf()] === null) {
                  evidence.evidenceURL = '';
                } else {
                  evidence.evidenceURL = formValues[evidenceUrlID.valueOf()];
                }
                if (formValues[evidenceCodeID.valueOf()] === null) {
                  evidence.description = '';
                } else {
                  evidence.description = formValues[evidenceCodeID.valueOf()];
                }
                if (formValues[evidenceIssuerID.valueOf()] === null) {
                  evidenceIssuer.name = '';
                } else {
                  evidenceIssuer.name = formValues[evidenceIssuerID.valueOf()];
                }
                // evidence.evidenceURL = formValues[evidenceUrlID.valueOf()];
                // evidence.description = formValues[evidenceCodeID.valueOf()];
                // evidenceIssuer.name = formValues[evidenceIssuerID.valueOf()];
                evidenceIssuer.website = '';
                evidenceIssuer.id = null;
                evidence.evidenceIssuer = evidenceIssuer;
                evidence.confidentialityLevelCode = 'PUBLIC';

                // console.log(evidence);
                // check if evidence already exists, if exists edit evidence object else push new evidence

                const evi = evidenceList.find((ev, i) => {
                  if (ev.id === evidence.id) {
                    evidenceList[i] = evidence;
                    return true;
                  }
                });
                if (!evi) {
                  evidenceList.push(evidence);
                }
                // console.log(evidenceList);
              }

              // console.log(evidenceList);

              // console.log(JSON.stringify(this.dataService.evidenceList));
              req.response.uuid = null;
            } else if (req.responseDataType === 'CODE' && this.utilities.qualificationApplicationType === 'regulated') {
              if (req.responseValuesRelatedArtefact === 'CPVCodes') {
                req.response.evidenceURLCode = this.utilities.cpvTemplate[req.uuid];
              } else {
                req.response.evidenceURLCode = formValues[req.uuid.valueOf()];
              }
              req.response.uuid = null;
            } else if (req.responseDataType === 'CODE' && this.utilities.qualificationApplicationType === 'selfcontained') {
              if (req.responseValuesRelatedArtefact === 'CPVCodes') {
                req.response.evidenceURLCode = this.utilities.cpvTemplate[req.uuid];
              } else {
                req.response.evidenceURLCode = formValues[req.uuid.valueOf()];
              }
              req.response.uuid = null;
            } else if (req.responseDataType === 'DATE') {
              req.response.date = formValues[req.uuid.valueOf()];
              if (typeof req.response.date !== 'string' && req.response.date !== null && req.response.date !== undefined) {
                const utcDate = this.utilities.toUTCDate(req.response.date);
                req.response.date = moment(utcDate);
              }
              req.response.uuid = null;
            } else if (req.responseDataType === 'PERCENTAGE') {
              req.response.percentage = formValues[req.uuid.valueOf()];
              req.response.uuid = null;
            } else if (req.responseDataType === 'PERIOD' && this.APIService.version === 'v1') {
              req.response.period = formValues[req.uuid.valueOf()];
              req.response.uuid = null;
            } else if (req.responseDataType === 'PERIOD' && this.APIService.version === 'v2') {
              // req.response.period = formValues[req.uuid.valueOf()];
              const startDateid = req.uuid + 'startDate';
              req.response.startDate = formValues[startDateid.valueOf()];
              if (typeof req.response.startDate !== 'string' && req.response.startDate !== null) {
                const utcDate = this.utilities.toUTCDate(req.response.startDate);
                req.response.startDate = moment(utcDate);
              }
              // console.log(req.response.startDate);
              const endDateid = req.uuid + 'endDate';
              req.response.endDate = formValues[endDateid.valueOf()];
              if (typeof req.response.endDate !== 'string' && req.response.endDate !== null) {
                const utcDate = this.utilities.toUTCDate(req.response.endDate);
                req.response.endDate = moment(utcDate);
              }
              // console.log(req.response.endDate);

              req.response.uuid = null;
            } else if (req.responseDataType === 'CODE_COUNTRY') {
              req.response.countryCode = formValues[req.uuid.valueOf()];
              req.response.uuid = null;
            } else if (req.responseDataType === 'AMOUNT') {
              const currencyid = req.uuid + 'currency';
              // AMOUNT quickfix
              if (formValues[req.uuid.valueOf()] === '' && formValues[currencyid.valueOf()] === null) {
                req.response = null;
              } else {
                req.response.amount = this.utilities.amountTransform(formValues[req.uuid.valueOf()].toString());
                // console.log(formValues[currencyid.valueOf()]);
                req.response.currency = formValues[currencyid.valueOf()];
                req.response.uuid = null;
              }
            } else if (req.responseDataType === 'QUANTITY_INTEGER') {
              if (formValues[req.uuid.valueOf()] === '') {
                req.response = null;
              } else {
                req.response.quantity = formValues[req.uuid.valueOf()];
                req.response.uuid = null;
              }

            } else if (req.responseDataType === 'QUANTITY') {
              if (formValues[req.uuid.valueOf()] === '') {
                req.response = null;
              } else {
                req.response.quantity = formValues[req.uuid.valueOf()];
                req.response.uuid = null;
              }

            } else if (req.responseDataType === 'QUANTITY_YEAR') {
              if (formValues[req.uuid.valueOf()] === '') {
                req.response = null;
              } else {
                req.response.year = formValues[req.uuid.valueOf()];
                req.response.uuid = null;
              }
            } else if (req.responseDataType === 'IDENTIFIER') {
              req.response.identifier = formValues[req.uuid.valueOf()];
              req.response.uuid = null;
            } else if (req.responseDataType === 'URL') {
              req.response.url = formValues[req.uuid.valueOf()];
              req.response.uuid = null;
            } else if (req.responseDataType === 'ECONOMIC_OPERATOR_IDENTIFIER') {
              req.response.id = formValues[req.uuid.valueOf()];
              const eoidtypeID = req.uuid + 'eoidtype';
              req.response.eoidtype = formValues[eoidtypeID.valueOf()];
              req.response.uuid = null;
              // else if (req.responseDataType === 'ECONOMIC_OPERATOR_ROLE_CODE') {
              //   req.response.description = formValues[req.uuid.valueOf()];
            } else if (req.responseDataType === 'LOT_IDENTIFIER') {
              // req.response.lots = this.utilities.lotTemplate[req.uuid];
              if (formValues[req.uuid.valueOf()] === null || formValues[req.uuid.valueOf()] === '' || formValues[req.uuid.valueOf()].length === 0) {
                req.response.lots = null;
              } else {
                req.response.lots = formValues[req.uuid.valueOf()];
                if (this.utilities.isEmptyStringArray(req.response.lots)) {
                  req.response = null;
                }
              }
            }
          }
        });
      }
      if (rg.requirementGroups != null || rg.requirementGroups != undefined) {

        let firstRgFormValues = null;
        let firstRgId = rg.uuid;
        firstRgFormValues = formValues;
        // console.log('This is Rg ID out ' + firstRgId);
        rg.requirementGroups.forEach(rg2 => {
          // console.log('outer reqgroup id ' + rg.uuid);
          // console.log('inner reqgroup id ' + rg2.uuid);
          if (rg.uuid == firstRgId) {
            // console.log('Reset to first ReqGroup ');
            formValues = firstRgFormValues;
          }
          // fix
          if (formValues[rg2.uuid.valueOf()] != undefined) {
            formValues = formValues[rg2.uuid.valueOf()];
          }
          // console.log(formValues);
          // console.log('reqGroup inside curs ' + rg2.uuid);
          this.getFromForm(rg2, cr, form, formValues, evidenceList);
        });
      }
    }
  }


  /* ============================= EXTRACT VALUES FROM FORMS ================================================ */
  extractFormValuesFromCriteria(criteria: EoRelatedCriterion[], form: FormGroup, evidenceList: Evidence[]) {
    criteria.forEach(cr => {
      let formValues = form.getRawValue();
      formValues = formValues[cr.uuid.valueOf()];
      /* GES-131 Fix: set selected true because of server config file in create response from scratch */
      if (this.utilities.isCreateResponse) {
        cr.selected = true;
      }
      // console.log(formValues);

      // let testFormValues = formValues[cr.uuid.valueOf()];
      // console.log('cr loop: ' + cr.uuid);

      let testFormValues = null;

      cr.requirementGroups.forEach(rg => {
        // console.log('first rg loop: ' + rg.uuid);

        if (testFormValues == null) {
          testFormValues = form.getRawValue();
          testFormValues = testFormValues[cr.uuid.valueOf()];
          // formValues = testFormValues;
        }

        if (formValues[rg.uuid.valueOf()] === undefined) {

          // fix go up a level
          testFormValues = form.getRawValue();
          testFormValues = testFormValues[cr.uuid.valueOf()];
          testFormValues = testFormValues[rg.uuid.valueOf()];
          // fix

          // console.log('THIS IS undefined');
          this.getFromForm(rg, cr, form, testFormValues, evidenceList);
        } else if (formValues[rg.uuid.valueOf()] !== undefined) {
          // console.log('THIS IS DEFINED');
          formValues = formValues[rg.uuid.valueOf()];
          this.getFromForm(rg, cr, form, formValues, evidenceList);
        }
      });
    });
  }


  /* ======================================= CREATE TEMPLATE FORMGROUPS FOR CARDINALITIES =====================*/
  createTemplateFormGroup(id: string): FormGroup {
    return this.toTemplateFormGroup(this.template[id]);
  }


  toTemplateFormGroup(rg: RequirementGroup) {
    let group: any = {};
    if (rg) {
      if (rg.requirements !== undefined) {
        rg.requirements.forEach(r => {
          group[r.uuid] = new FormControl();
          if (r.responseDataType === 'EVIDENCE_IDENTIFIER') {
            group[r.uuid + 'evidenceUrl'] = new FormControl();
            group[r.uuid + 'evidenceCode'] = new FormControl();
            group[r.uuid + 'evidenceIssuer'] = new FormControl();
          } else if (r.responseDataType === 'PERIOD' && this.APIService.version === 'v2') {
            group[r.uuid + 'startDate'] = new FormControl();
            group[r.uuid + 'endDate'] = new FormControl();
          } else if (r.responseDataType === 'INDICATOR' || r.responseDataType === 'CODE_BOOLEAN') {
            group[r.uuid] = new FormControl(false);
          } else if (r.responseDataType === 'WEIGHT_INDICATOR') {
            group[r.uuid] = new FormControl(false);
            // group[r.uuid + 'evaluationMethodType'] = new FormControl();
            group[r.uuid + 'weight'] = new FormControl();
            group[r.uuid + 'evaluationMethodDescription'] = new FormControl();
          } else if (r.responseDataType === 'AMOUNT') {
            group[r.uuid + 'currency'] = new FormControl();
          } else if (r.responseDataType === 'LOT_IDENTIFIER') {
            group[r.uuid] = new FormControl();
            this.utilities.renderLotTemplate[r.uuid] = [];
          } else if (r.responseDataType === 'ECONOMIC_OPERATOR_IDENTIFIER') {
            group[r.uuid] = new FormControl();
            group[r.uuid + 'eoidtype'] = new FormControl();
          } else {
            group[r.uuid] = new FormControl();
          }
        });
      }
      if (rg.requirementGroups != null || rg.requirementGroups !== undefined) {
        rg.requirementGroups.forEach(rg => {
          // console.log('Req Group ' + rg.uuid);
          group[rg.uuid] = this.toTemplateFormGroup(rg);
        });
      }
    }
    let fg = new FormGroup(group);
    return fg;
  }


  /* ========================================= CREATE CRITERION FORMS =================================== */

  createExclusionCriterionForm(criteria: ExclusionCriteria[], isSelection: boolean) {
    let group: any = {};
    criteria.forEach(cr => {
      group[cr.uuid] = this.createFormGroups(cr.requirementGroups, isSelection);
      // console.log(group[cr.typeCode]);
    });
    let fg = new FormGroup(group);
    // console.log(fg);
    return fg;
  }

  createSelectionCriterionForm(criteria: SelectionCriteria[], isSelection: boolean) {
    let group: any = {};
    criteria.forEach(cr => {
      group[cr.uuid] = this.createFormGroups(cr.requirementGroups, isSelection);
      // console.log(group[cr.typeCode]);
    });
    let fg = new FormGroup(group);
    // console.log(fg);
    return fg;
  }

  createReductionCriterionForm(criteria: ReductionCriterion[], isSelection: boolean) {
    let group: any = {};
    /* GES-2: Make the default answer as YES when it's v2 reduction.*/
    if (this.APIService.version === 'v2') {
      isSelection = true;
    }
    criteria.forEach(cr => {
      group[cr.uuid] = this.createFormGroups(cr.requirementGroups, isSelection);
      // console.log(group[cr.typeCode]);
    });
    let fg = new FormGroup(group);

    // console.log(fg);
    return fg;
  }

  createEORelatedCriterionForm(criteria: EoRelatedCriterion[], isSelection: boolean) {
    let group: any = {};
    criteria.forEach(cr => {
      group[cr.uuid] = this.createFormGroups(cr.requirementGroups, isSelection);
      // console.log(group[cr.typeCode]);
    });
    let fg = new FormGroup(group);

    // console.log(fg);
    return fg;
  }

  createCARelatedCriterionForm(criteria: CaRelatedCriterion[], isSelection: boolean) {
    let group: any = {};
    criteria.forEach(cr => {
      group[cr.uuid] = this.createFormGroups(cr.requirementGroups, isSelection);
      // console.log(group[cr.typeCode]);
    });
    let fg = new FormGroup(group);

    // console.log(fg);
    return fg;
  }


  createFormGroups(reqGroups: RequirementGroup[], isSelection: boolean) {
    let group: any = {};
    reqGroups.forEach(rg => {
      group[rg.uuid] = this.toFormGroup(rg, isSelection);
    });
    // console.log(group);
    let fg = new FormGroup(group);
    // console.log(fg);
    return fg;
  }

  toFormGroup(rg: RequirementGroup, isSelection: boolean) {
    let group: any = {};
    if (rg) {
      // console.log('In Req Group: ' + rg.id);
      if (rg.requirements != undefined) {
        rg.requirements.forEach(r => {
          if (r.response != null || r.response != undefined) {

            /* SELF-CONTAINED: Disable fields with typeCode REQUIREMENT or CAPTION when the user has the role of EO.
            These fields need to be non editable */
            group[r.uuid] = new FormControl({
              value: r.response.description ||
                r.response.percentage || r.response.evidenceURL || r.response.countryCode ||
                r.response.period || r.response.quantity || r.response.year || r.response.url || r.response.identifier || '',
              disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
            });

            // form reset in case of new espd
            if (this.utilities.isReset && (this.utilities.isCreateResponse || this.utilities.isCreateNewESPD)) {
              group[r.uuid] = new FormControl({
                value: '',
                disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
              });
            }


            // YES/NO if responseDataType is indicator then pass indicator value to formControl. (initial state problem fixed)
            if (r.responseDataType === 'INDICATOR' || r.responseDataType === 'CODE_BOOLEAN') {
              if (this.utilities.isReset && (this.utilities.isCreateResponse || this.utilities.isCreateNewESPD)) {
                if (isSelection) {
                  group[r.uuid] = new FormControl(true);
                } else {
                  group[r.uuid] = new FormControl(false);
                }

              } else {
                group[r.uuid] = new FormControl(r.response.indicator);
              }
            }
            /* SELF-CONTAINED: WEIGHT_INDICATOR */
            if (r.responseDataType === 'WEIGHT_INDICATOR') {
              if (this.utilities.isReset && (this.utilities.isCreateResponse || this.utilities.isCreateNewESPD)) {
                group[r.uuid] = new FormControl(false);
                // group[r.uuid + 'evaluationMethodType'] = new FormControl();
                group[r.uuid + 'weight'] = new FormControl();
                group[r.uuid + 'evaluationMethodDescription'] = new FormControl();
              } else {
                if (r.response.indicator) {
                  group[r.uuid] = new FormControl({
                    value: true,
                    disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                  });
                  this.utilities.criterionWeightIndicators[r.uuid] = true;
                  /* if even one criterion's indicator is true then the global indicator is true also */
                  this.utilities.isGloballyWeighted = true;
                } else {
                  group[r.uuid] = new FormControl({
                    value: false,
                    disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                  });
                  this.utilities.criterionWeightIndicators[r.uuid] = false;
                }

                // group[r.uuid + 'evaluationMethodType'] = new FormControl(r.response.evaluationMethodType);
                group[r.uuid + 'weight'] = new FormControl({
                  value: r.response.weight,
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
                group[r.uuid + 'evaluationMethodDescription'] = new FormControl({
                  value: r.response.evaluationMethodDescription,
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              }
            }
            /* SELF-CONTAINED: LOT_IDENTIFIER */
            if (r.responseDataType === 'LOT_IDENTIFIER') {
              if (r.response.lots !== undefined && r.response.lots !== null) {
                group[r.uuid] = new FormControl({
                  value: r.response.lots,
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
                this.utilities.renderLotTemplate[r.uuid] = r.response.lots;
              } else {
                group[r.uuid] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
                this.utilities.renderLotTemplate[r.uuid] = [];
              }
            }

            /* SELF-CONTAINED: responseDataType: CODE ---> CpvCodes*/
            if (r.responseDataType === 'CODE' && r.responseValuesRelatedArtefact === 'CPVCodes') {
              if (r.response.evidenceURLCode !== null && r.response.evidenceURLCode !== undefined) {
                // console.log('RENDERING CPVS: ');
                this.utilities.renderCpvTemplate[r.uuid] = this.utilities.stringToCpvCode(r.response.evidenceURLCode.toString());
                // console.log(this.utilities.renderCpvTemplate[r.uuid]);
                // console.log(this.utilities.renderCpvTemplate);
              } else {
                this.utilities.renderCpvTemplate[r.uuid] = [];
              }
            }
            if (r.responseDataType === 'CODE' && this.utilities.qualificationApplicationType === 'regulated') {
              if (r.response.evidenceURLCode) {
                if (this.utilities.isReset && (this.utilities.isCreateResponse || this.utilities.isCreateNewESPD)) {
                  group[r.uuid] = new FormControl({
                    value: '',
                    disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                  });
                } else {
                  group[r.uuid] = new FormControl({
                    value: r.response.evidenceURLCode,
                    disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                  });
                }
              }
            }
            if (r.responseDataType === 'CODE' && this.utilities.qualificationApplicationType === 'selfcontained') {
              if (r.response.evidenceURLCode) {
                if (this.utilities.isReset && (this.utilities.isCreateResponse || this.utilities.isCreateNewESPD)) {
                  group[r.uuid] = new FormControl({
                    value: '',
                    disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                  });
                } else {
                  group[r.uuid] = new FormControl({
                    value: r.response.evidenceURLCode,
                    disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                  });
                }
              }
            }
            if (r.response.date) {
              if (this.utilities.isReset && (this.utilities.isCreateResponse || this.utilities.isCreateNewESPD)) {
                group[r.uuid] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              } else {
                group[r.uuid] = new FormControl({
                  value: r.response.date,
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              }
            }

            // FIX: starDate-endDate null value case when AtoD Criteria are selected
            if (r.response.startDate) {
              if (this.utilities.isReset && (this.utilities.isCreateResponse || this.utilities.isCreateNewESPD)) {
                group[r.uuid + 'startDate'] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              } else {
                group[r.uuid + 'startDate'] = new FormControl({
                  value: r.response.startDate,
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              }
            } else if (r.response.startDate === null || stringify(r.response.startDate) === '') {
              group[r.uuid + 'startDate'] = new FormControl({
                value: '',
                disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
              });
            }
            if (r.response.endDate) {
              if (this.utilities.isReset && (this.utilities.isCreateResponse || this.utilities.isCreateNewESPD)) {
                group[r.uuid + 'endDate'] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              } else {
                group[r.uuid + 'endDate'] = new FormControl({
                  value: r.response.endDate,
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              }
            } else if (r.response.endDate === null || stringify(r.response.endDate) === '') {
              group[r.uuid + 'endDate'] = new FormControl({
                value: '',
                disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
              });
            }

            if (r.response.evidenceSuppliedId) {

              // FIX: find evidence in EvidenceList object and import it
              if (this.evidenceList !== undefined) {
                const evi = this.evidenceList.find((ev) => {
                  if (ev.id === r.response.evidenceSuppliedId) {
                    // this.evidenceList[i].description = 'test';
                    return true;
                  }
                });
                /* FIX: self-contained cannot set evidenceURL of undefined issue */
                if (evi !== undefined) {
                  group[r.uuid + 'evidenceUrl'] = new FormControl({
                      value: evi.evidenceURL,
                      disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO,
                    },
                    [UrlValidation]);
                  group[r.uuid + 'evidenceCode'] = new FormControl({
                    value: evi.description,
                    disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                  });
                  group[r.uuid + 'evidenceIssuer'] = new FormControl({
                    value: evi.evidenceIssuer.name,
                    disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                  });
                }
              }
              // console.log(evi);
              // console.log(typeof evi);

              if (this.utilities.isReset && (this.utilities.isCreateResponse || this.utilities.isCreateNewESPD)) {
                group[r.uuid + 'evidenceUrl'] = new FormControl({
                    value: '',
                    disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO,
                  },
                  [UrlValidation]);
                group[r.uuid + 'evidenceCode'] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
                group[r.uuid + 'evidenceIssuer'] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              }
            }

            /* SELF-CONTAINED: ECONOMIC_OPERATOR_IDENTIFIER */
            if (r.responseDataType === 'ECONOMIC_OPERATOR_IDENTIFIER') {
              if (r.response.id !== null || r.response.eoidtype !== null) {
                group[r.uuid] = new FormControl(r.response.id);
                group[r.uuid + 'eoidtype'] = new FormControl(r.response.eoidtype);
              } else {
                group[r.uuid] = new FormControl();
                group[r.uuid + 'eoidtype'] = new FormControl();
              }
            }

            /* SELF-CONTAINED 2.1.0 : ECONOMIC_OPERATOR_ROLE_CODE */
            // if (r.responseDataType === 'ECONOMIC_OPERATOR_ROLE_CODE') {
            //   if (r.response.description !== null) {
            //     group[r.uuid] = new FormControl(r.response.description);
            //   } else {
            //     group[r.uuid] = new FormControl();
            //   }
            // }

            if (r.response.currency || r.response.amount) {
              if (this.utilities.isReset && (this.utilities.isCreateResponse || this.utilities.isCreateNewESPD)) {
                group[r.uuid] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              } else {
                group[r.uuid] = new FormControl({
                  value: r.response.amount,
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              }
              if (r.response.currency !== null && r.response.currency !== undefined) {
                if (this.utilities.isReset && (this.utilities.isCreateResponse || this.utilities.isCreateNewESPD)) {
                  group[r.uuid + 'currency'] = new FormControl({
                    value: '',
                    disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                  });
                } else {
                  group[r.uuid + 'currency'] = new FormControl({
                    value: r.response.currency,
                    disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                  });
                }
              }
            }
            // in case of request import
            if (r.response.currency === null || r.response.amount === '0' || r.response.currency === '' || r.response.amount === '') {
              group[r.uuid + 'currency'] = new FormControl({
                value: '',
                disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
              });
            }


            // console.log(r.response);
          } else {
            r.response = new RequirementResponse();
            group[r.uuid] = new FormControl(r.response.description || '');
            /* SELF-CONTAINED: WEIGHT_INDICATOR */
            if (this.utilities.isCA) {
              if (r.responseDataType === 'WEIGHT_INDICATOR') {
                group[r.uuid] = new FormControl(false);
                // group[r.uuid + 'evaluationMethodType'] = new FormControl();
                group[r.uuid + 'weight'] = new FormControl();
                group[r.uuid + 'evaluationMethodDescription'] = new FormControl();
              }
              if (r.responseDataType === 'INDICATOR' || r.responseDataType === 'CODE_BOOLEAN') {
                group[r.uuid] = new FormControl({
                  value: false,
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              }
              if (r.responseDataType === 'AMOUNT') {
                group[r.uuid] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
                group[r.uuid + 'currency'] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              }
              if (r.responseDataType === 'PERIOD' && this.APIService.version === 'v2') {
                group[r.uuid + 'startDate'] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
                group[r.uuid + 'endDate'] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              }
            }
            if (this.utilities.isEO) {
              if (isSelection) {
                if (r.responseDataType === 'INDICATOR' || r.responseDataType === 'CODE_BOOLEAN') {
                  group[r.uuid] = new FormControl({
                    value: true,
                    disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                  });
                }
              } else {
                if (r.responseDataType === 'INDICATOR' || r.responseDataType === 'CODE_BOOLEAN') {
                  group[r.uuid] = new FormControl({
                    value: false,
                    disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                  });
                }
              }

              // if (r.responseDataType === 'CODE' && this.APIService.version === 'v1') {
              //   group[r.uuid] = new FormControl();
              // }

              if (r.responseDataType === 'CODE' && r.responseValuesRelatedArtefact === 'CPVCodes') {
                this.utilities.renderCpvTemplate[r.uuid] = [];
              }
              if (r.responseDataType === 'AMOUNT') {
                group[r.uuid] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
                group[r.uuid + 'currency'] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              }

              if (r.responseDataType === 'ECONOMIC_OPERATOR_IDENTIFIER') {
                group[r.uuid] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
                group[r.uuid + 'eoidtype'] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              }
              /* SELF-CONTAINED 2.1.0: ECONOMIC_OPERATOR_ROLE_CODE */
              // if (r.responseDataType === 'ECONOMIC_OPERATOR_ROLE_CODE') {
              //   group[r.uuid] = new FormControl({
              //     value: '',
              //     disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
              //   });
              // }


              if (r.responseDataType === 'WEIGHT_INDICATOR') {
                group[r.uuid] = new FormControl(false);
                // group[r.uuid + 'evaluationMethodType'] = new FormControl({
                //   value: '',
                //   disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                // });
                group[r.uuid + 'weight'] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
                group[r.uuid + 'evaluationMethodDescription'] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              }

              // group[r.uuid + 'startDate'] = new FormControl();
              // group[r.uuid + 'endDate'] = new FormControl();
              if (r.responseDataType === 'PERIOD' && this.APIService.version === 'v2') {
                group[r.uuid + 'startDate'] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
                group[r.uuid + 'endDate'] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              }
              if (r.responseDataType === 'EVIDENCE_IDENTIFIER') {
                group[r.uuid + 'evidenceUrl'] = new FormControl({
                    value: '',
                    disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO,
                  },
                  [UrlValidation]
                )
                ;
                group[r.uuid + 'evidenceCode'] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
                group[r.uuid + 'evidenceIssuer'] = new FormControl({
                  value: '',
                  disabled: (r.type === 'REQUIREMENT' || r.type === 'CAPTION') && this.utilities.isEO
                });
              }
            }

          }

          // console.log(group);
          // console.log(group[r.uuid]);
        });
      }
      if (rg.requirementGroups != null || rg.requirementGroups != undefined) {
        rg.requirementGroups.forEach(rg => {
          // console.log('Req Group ' + rg.uuid);
          group[rg.uuid] = this.toFormGroup(rg, isSelection);
        });
      }
    }
    let fg = new FormGroup(group);

    // console.log(fg.getRawValue());
    return fg;
  }


}
