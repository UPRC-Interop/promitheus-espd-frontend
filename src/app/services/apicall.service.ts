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
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import {ExclusionCriteria} from '../model/exclusionCriteria.model';
import {SelectionCriteria} from '../model/selectionCriteria.model';
import {ESPDRequest} from '../model/ESPDRequest.model';
import {EoRelatedCriterion} from '../model/eoRelatedCriterion.model';
import {ReductionCriterion} from '../model/reductionCriterion.model';
import {ESPDResponse} from '../model/ESPDResponse.model';
import {environment} from '../../environments/environment';
import {Language} from '../model/language.model';
import {UtilitiesService} from './utilities.service';
import {CodeList} from '../model/codeList.model';
import {ECertisCriterion} from '../model/eCertisCriterion.model';
import {FullCriterion} from '../model/fullCriterion.model';
import {PlatformInfo} from '../model/platform-info';
import {ErrorResponse} from "../model/error-response";

// import {DataService} from '../services/data.service';

@Injectable()
export class ApicallService {

  /* ============ CODELISTS =============*/

  // version: string = 'v1';
  // version: string = 'v2';
  version: string;


  constructor(private http: HttpClient, public utilities: UtilitiesService) {
  }

  getPlatformInfo() {
    return this.http.get<PlatformInfo>(environment.apiUrl + 'platform-info').toPromise();
  }

  getCountryList() {
    return this.http.get<CodeList[]>(environment.apiUrl + 'v2/codelists/CountryIdentification/lang/'
      + this.utilities.selectedLang).toPromise();
  }

  getCurr() {
    return this.http.get<CodeList[]>(environment.apiUrl + 'v2/codelists/Currency/lang/' + this.utilities.selectedLang).toPromise();
  }

  getLangs() {
    return this.http.get<Language[]>(environment.apiUrl + 'v2/codelists/LanguageCodeEU/lang/' + this.utilities.selectedLang).toPromise();
  }

  /* SELF-CONTAINED: Codelists*/
  get_eoIDTypes() {
    return this.http.get<CodeList[]>(environment.apiUrl + 'v2/codelists/EOIDType/lang/' + this.utilities.selectedLang).toPromise();
  }

  get_EvaluationMethodType() {
    return this.http.get<CodeList[]>(environment.apiUrl + 'v2/codelists/EvaluationMethodType/lang/'
      + this.utilities.selectedLang).toPromise();
  }

  getProcedureType() {
    return this.http.get<CodeList[]>(environment.apiUrl + 'v2/codelists/ProcedureType/lang/'
      + this.utilities.selectedLang).toPromise();
  }

  get_ProjectType() {
    return this.http.get<CodeList[]>(environment.apiUrl + 'v2/codelists/ProjectType/lang/' + this.utilities.selectedLang).toPromise();
  }

  get_BidType() {
    return this.http.get<CodeList[]>(environment.apiUrl + 'v2/codelists/BidType/lang/' + this.utilities.selectedLang).toPromise();
  }

  get_WeightingType() {
    return this.http.get<CodeList[]>(environment.apiUrl + 'v2/codelists/WeightingType/lang/'
      + this.utilities.selectedLang).toPromise();
  }

  get_eoRoleType() {
    return this.http.get<CodeList[]>(environment.apiUrl + 'v2/codelists/EORoleType/lang/' + this.utilities.selectedLang).toPromise();
  }

  get_financialRatioType() {
    return this.http.get<CodeList[]>(environment.apiUrl + 'v2/codelists/FinancialRatioType/lang/'
      + this.utilities.selectedLang).toPromise();
  }


  /* eCertis national criteria */

  getECertisData(criterion: FullCriterion, euID: string, countryCode: string, language: string): Promise<ECertisCriterion[]> {
    if (!this.utilities.isEmpty(criterion.subCriterionList)) {
      return Promise.resolve(criterion.subCriterionList);
    } else {
      return this.get_eCertisCriteria(euID, countryCode, language)
        .then(res => {
          criterion.subCriterionList = res.map(x => ({...x}));
          return Promise.resolve(criterion.subCriterionList);
        }).catch((err) => {
          console.log(err);
          const error: ErrorResponse = err.error;
          console.log(err.error);
          const action = 'close';
          this.utilities.openSnackBar(error, action);
          return Promise.reject(err);
        });
    }
  }

  get_eCertisCriteria(euId: string, countryCode: string, language: string) {
    return this.http.get<ECertisCriterion[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/eCertisData/' + euId + '/country/' + countryCode + '/lang/' + language).toPromise();
  }


  /* ==================== EO related criteria ========================= */

  getEO_RelatedCriteria() {
    return this.http.get<EoRelatedCriterion[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/eo_related').toPromise();
  }

  getEO_RelatedACriteria() {
    return this.http.get<EoRelatedCriterion[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/eo_related_A').toPromise();
  }

  getEO_RelatedCCriteria() {
    return this.http.get<EoRelatedCriterion[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/eo_related_B').toPromise();
  }

  getEO_RelatedDCriteria() {
    return this.http.get<EoRelatedCriterion[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/eo_related_C').toPromise();
  }

  getEO_LotCriterion() {
    return this.http.get<EoRelatedCriterion[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/eo_lots').toPromise();
  }

  /* SELF-CONTAINED: CA related Criterion - CA LOTS */

  getCA_RelatedCriteria() {
    return this.http.get<EoRelatedCriterion[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/other_ca').toPromise();
  }

  /* =========================== Reduction of Candidates ================= */

  get_ReductionCriteria() {
    return this.http.get<ReductionCriterion[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/reduction').toPromise();
  }

  /* ============= EXCLUSION CRITERIA ===================*/
  getExclusionCriteria() {
    return this.http.get<ExclusionCriteria[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/exclusion').toPromise();
  }

  getExclusionCriteria_A() {
    return this.http.get<ExclusionCriteria[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/exclusion_a?contractingOperator=' + this.utilities.role).toPromise();
  }

  getExclusionCriteria_B() {
    return this.http.get<ExclusionCriteria[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/exclusion_b?contractingOperator=' + this.utilities.role).toPromise();
  }

  getExclusionCriteria_C() {
    return this.http.get<ExclusionCriteria[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/exclusion_c?contractingOperator=' + this.utilities.role).toPromise();
  }

  getExclusionCriteria_D() {
    return this.http.get<ExclusionCriteria[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/exclusion_d?contractingOperator=' + this.utilities.role).toPromise();
  }

  /* ============= SELECTION CRITERIA ===================*/

  getSelectionCriteria() {
    return this.http.get<SelectionCriteria[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/selection?contractingOperator=' + this.utilities.role).toPromise();
  }

  getSelectionCriteria_A() {
    return this.http.get<SelectionCriteria[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/selection_a?contractingOperator=' + this.utilities.role).toPromise();
  }

  getSelectionCriteria_B() {
    return this.http.get<SelectionCriteria[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/selection_b?contractingOperator=' + this.utilities.role).toPromise();
  }

  getSelectionCriteria_C() {
    return this.http.get<SelectionCriteria[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/selection_c?contractingOperator=' + this.utilities.role).toPromise();
  }

  getSelectionCriteria_D() {
    return this.http.get<SelectionCriteria[]>(environment.apiUrl + this.version + '/' + this.utilities.qualificationApplicationType +
      '/criteria/selection_d?contractingOperator=' + this.utilities.role).toPromise();
  }

  /* ============ UPLOAD XML GET JSON ================= */
  postFile(filesToUpload: File[]) {

    const formData: FormData = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
      formData.append(`files[]`, filesToUpload[i], filesToUpload[i].name);
    }
    // console.log(formData);
    // const header = new HttpHeaders({'Content-Type':'application/xml; charset=utf-8'});
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/xml; charset=utf-8');
    // return this.http.post<ESPDRequest>(environment.apiUrl + '/importESPD/request', formData).toPromise();
    return this.http.post<ESPDRequest>(environment.apiUrl + 'importESPD/request', formData).toPromise();

  }

  postFileResponse(filesToUpload: File[]) {

    const formData: FormData = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
      formData.append(`files[]`, filesToUpload[i], filesToUpload[i].name);
    }
    // console.log(formData);
    // const header = new HttpHeaders({'Content-Type':'application/xml; charset=utf-8'});
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/xml; charset=utf-8');
    return this.http.post<ESPDResponse>(environment.apiUrl + 'importESPD/response', formData).toPromise();

  }

  /* ================= UPLOAD JSON GET XML Request ================================= */
  getXMLRequest(ESPDRequest: string, language: string) {
    return this.getRequestExport(ESPDRequest, '/espd/request/xml', language);
  }

  getHTMLRequest(ESPDRequest: string, language: string) {
    return this.getRequestExport(ESPDRequest, '/espd/request/html', language);
  }

  getPDFRequest(ESPDRequest: string, language: string) {
    return this.getRequestExport(ESPDRequest, '/espd/request/pdf', language);
  }

  private getRequestExport(ESPDRequest: string, endpoint: string, language: string) {
    console.log(ESPDRequest);
    let header = new HttpHeaders();
    let _header = header.append('Content-Type', 'application/json; charset=utf-8');
    let params = new HttpParams().set('language', language);
    let options: Object = {
      headers: _header,
      responseType: 'blob' as 'blob',
      observe: 'response' as 'response',
      params: params
    };

    // headers = header.append('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<any>(environment.apiUrl + this.version + endpoint, ESPDRequest, options).toPromise();
  }

  getXMLRequestV2(ESPDRequest: string) {

    let header = new HttpHeaders();
    let _header = header.append('Content-Type', 'application/json; charset=utf-8');

    let options: Object = {
      headers: _header,
      responseType: 'blob' as 'blob',
      observe: 'response' as 'response'
    };

    // headers = header.append('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<any>(environment.apiUrl + 'v2/espd/request', ESPDRequest, options).toPromise();
  }

  getHTMLResponse(ESPDResponse: string, language: string) {
    return this.getESPDResponseDocument(ESPDResponse, '/espd/response/html', language);
  }

  getPDFResponse(ESPDResponse: string, language: string) {
    return this.getESPDResponseDocument(ESPDResponse, '/espd/response/pdf', language);
  }

  getXMLResponse(ESPDResponse: string, language: string) {
    return this.getESPDResponseDocument(ESPDResponse, '/espd/response/xml', language);
  }

  private getESPDResponseDocument(ESPDResponse: string, endpoint: string, language: string) {
    console.log(ESPDResponse);

    let header = new HttpHeaders();
    let _header = header.append('Content-Type', 'application/json; charset=utf-8');

    let params = new HttpParams().set('language', language);
    let options: Object = {
      headers: _header,
      responseType: 'blob' as 'blob',
      observe: 'response' as 'response',
      params: params
    };

    // headers = header.append('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<any>(environment.apiUrl + this.version + endpoint, ESPDResponse, options).toPromise();
  }

  // getXMLResponseV2(ESPDResponse: string) {
  //
  //   let header = new HttpHeaders();
  //   let _header = header.append('Content-Type', 'application/json; charset=utf-8');
  //
  //   let options: Object = {
  //     headers: _header,
  //     responseType: 'blob' as 'blob',
  //     observe: 'response' as 'response'
  //   };
  //
  //   // headers = header.append('Content-Type', 'application/json; charset=utf-8');
  //   return this.http.post<any>(environment.apiUrl + 'v2/espd/response', ESPDResponse, options).toPromise();
  // }


}
