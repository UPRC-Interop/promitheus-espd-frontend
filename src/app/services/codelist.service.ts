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
import {CodeList} from '../model/codeList.model';
import {ApicallService} from './apicall.service';
import {UtilitiesService} from './utilities.service';
import {ErrorResponse} from "../model/error-response";

@Injectable({
  providedIn: 'root'
})
export class CodelistService {

  currency: CodeList[] = null;
  countries: CodeList[] = null;
  procedureTypes: CodeList[] = null;
  projectTypes: CodeList[] = null;
  bidTypes: CodeList[] = null;
  eoRoleTypes: CodeList[] = null;
  eoIDType: CodeList[] = null;
  financialRatioTypes: CodeList[] = null;
  weightingType: CodeList[] = null;
  evaluationMethodType: CodeList[] = null;


  constructor(private APIService: ApicallService, public utilities: UtilitiesService) {
    this.getCodelists();
  }

  getCodelists() {
    if (this.currency === null) {
      this.getCurrency()
        .then(res => {
          this.currency = res;
          // console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (this.countries === null) {
      this.getCountries()
        .then(res => {
          this.countries = res;
          // console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (this.eoIDType === null) {
      this.getEoIDTypes()
        .then(res => {
          this.eoIDType = res;
          // console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (this.bidTypes === null) {
      this.getBidTypes()
        .then(res => {
          this.bidTypes = res;
          // console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (this.financialRatioTypes === null) {
      this.getFinancialRatioTypes()
        .then(res => {
          this.financialRatioTypes = res;
          // console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (this.procedureTypes === null) {
      this.getProcedureTypes()
        .then(res => {
          this.procedureTypes = res;
          // console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (this.projectTypes === null) {
      this.getProjectTypes()
        .then(res => {
          this.projectTypes = res;
          // console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (this.eoRoleTypes === null) {
      this.getEORoleTypes()
        .then(res => {
          this.eoRoleTypes = res;
        })
        .catch(err => {
            console.log(err);
          }
        );
    }

    if (this.weightingType === null) {
      this.getWeightingType()
        .then(res => {
          this.weightingType = res;
        })
        .catch(err => {
            console.log(err);
          }
        );
    }


    // if (this.evaluationMethodType === null) {
    //   this.getEvalutationMethodTypes()
    //     .then(res => {
    //       this.evaluationMethodTypes = res;
    //       // console.log(res);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // }
  }

  reloadCodelists() {
    this.currency = null;
    this.countries = null;
    this.procedureTypes = null;
    this.projectTypes = null;
    this.bidTypes = null;
    this.eoRoleTypes = null;
    this.eoIDType = null;
    this.financialRatioTypes = null;
    this.weightingType = null;
    this.evaluationMethodType = null;

    this.getCodelists();
  }


  getCurrency(): Promise<CodeList[]> {
    if (this.currency !== null && this.currency !== undefined) {
      return Promise.resolve(this.currency);
    } else {
      return this.APIService.getCurr()
        .then(res => {
          this.currency = res;
          return Promise.resolve(res);
        })
        .catch(err => {
          console.log(err);
          const error: ErrorResponse = err.error;
          console.log(err.error);
          const action = 'close';
          this.utilities.openSnackBar(error, action);
          return Promise.reject(err);
        });
    }
  }

  getCountries(): Promise<CodeList[]> {
    if (this.countries !== null && this.countries !== undefined) {
      return Promise.resolve(this.countries);
    } else {
      return this.APIService.getCountryList()
        .then(res => {
          this.countries = res;
          return Promise.resolve(res);
        })
        .catch(err => {
          console.log(err);
          const error: ErrorResponse = err.error;
          console.log(err.error);
          const action = 'close';
          this.utilities.openSnackBar(error, action);
          return Promise.reject(err);
        });
    }
  }

  /* ============================= SELF-CONTAINED: codelists ========================*/

  getProcedureTypes(): Promise<CodeList[]> {
    if (this.procedureTypes !== null) {
      return Promise.resolve(this.procedureTypes);
    } else {
      return this.APIService.getProcedureType()
        .then(res => {
          this.procedureTypes = res;
          return Promise.resolve(res);
        })
        .catch(err => {
          console.log(err);
          const error: ErrorResponse = err.error;
          console.log(err.error);
          const action = 'close';
          this.utilities.openSnackBar(error, action);
          return Promise.reject(err);
        });
    }
  }

  getEoIDTypes(): Promise<CodeList[]> {
    if (this.eoIDType !== null && this.eoIDType !== undefined) {
      return Promise.resolve(this.eoIDType);
    } else {
      return this.APIService.get_eoIDTypes()
        .then(res => {
          this.eoIDType = res;
          return Promise.resolve(res);
        })
        .catch(err => {
          console.log(err);
          const error: ErrorResponse = err.error;
          console.log(err.error);
          const action = 'close';
          this.utilities.openSnackBar(error, action);
          return Promise.reject(err);
        });
    }
  }

  getEvalutationMethodTypes(): Promise<CodeList[]> {
    if (this.evaluationMethodType != null) {
      return Promise.resolve(this.evaluationMethodType);
    } else {
      return this.APIService.get_EvaluationMethodType()
        .then(res => {
          this.evaluationMethodType = res;
          return Promise.resolve(res);
        })
        .catch(err => {
          console.log(err);
          const error: ErrorResponse = err.error;
          console.log(err.error);
          const action = 'close';
          this.utilities.openSnackBar(error, action);
          return Promise.reject(err);
        });
    }
  }

  getProjectTypes(): Promise<CodeList[]> {
    if (this.projectTypes != null) {
      return Promise.resolve(this.projectTypes);
    } else {
      return this.APIService.get_ProjectType()
        .then(res => {
          this.projectTypes = res;
          return Promise.resolve(res);
        })
        .catch(err => {
          console.log(err);
          const error: ErrorResponse = err.error;
          console.log(err.error);
          const action = 'close';
          this.utilities.openSnackBar(error, action);
          return Promise.reject(err);
        });
    }
  }

  getBidTypes(): Promise<CodeList[]> {
    if (this.bidTypes != null) {
      return Promise.resolve(this.bidTypes);
    } else {
      return this.APIService.get_BidType()
        .then(res => {
          this.bidTypes = res;
          return Promise.resolve(res);
        })
        .catch(err => {
          console.log(err);
          const error: ErrorResponse = err.error;
          console.log(err.error);
          const action = 'close';
          this.utilities.openSnackBar(error, action);
          return Promise.reject(err);
        });
    }
  }

  getFinancialRatioTypes(): Promise<CodeList[]> {
    if (this.financialRatioTypes != null) {
      return Promise.resolve(this.financialRatioTypes);
    } else {
      return this.APIService.get_financialRatioType()
        .then(res => {
          this.financialRatioTypes = res;
          return Promise.resolve(res);
        })
        .catch(err => {
          console.log(err);
          const error: ErrorResponse = err.error;
          console.log(err.error);
          const action = 'close';
          this.utilities.openSnackBar(error, action);
          return Promise.reject(err);
        });
    }
  }

  getWeightingType(): Promise<CodeList[]> {
    if (this.weightingType != null) {
      return Promise.resolve(this.weightingType);
    } else {
      return this.APIService.get_WeightingType()
        .then(res => {
          this.weightingType = res;
          return Promise.resolve(res);
        })
        .catch(err => {
          console.log(err);
          const error: ErrorResponse = err.error;
          console.log(err.error);
          const action = 'close';
          this.utilities.openSnackBar(error, action);
          return Promise.reject(err);
        });
    }
  }

  getEORoleTypes(): Promise<CodeList[]> {
    if (this.eoRoleTypes != null) {
      return Promise.resolve(this.eoRoleTypes);
    } else {
      return this.APIService.get_eoRoleType()
        .then(res => {
          this.eoRoleTypes = res;
          return Promise.resolve(res);
        })
        .catch(err => {
          console.log(err);
          const error: ErrorResponse = err.error;
          console.log(err.error);
          const action = 'close';
          this.utilities.openSnackBar(error, action);
          return Promise.reject(err);
        });
    }
  }


}

