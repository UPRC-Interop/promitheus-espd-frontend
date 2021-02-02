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

import {Cadetails} from './caDetails.model';
import {FullCriterion} from './fullCriterion.model';
import {DocumentDetails} from './documentDetails.model';

export class ESPDRequest {
  cadetails: Cadetails;
  fullCriterionList: FullCriterion[];
  documentDetails: DocumentDetails;

  constructor(cadetails: Cadetails, fullCriterionList: FullCriterion[], documentDetails: DocumentDetails) {
    this.cadetails = cadetails;
    this.fullCriterionList = fullCriterionList;
    this.documentDetails = documentDetails;
  }
}
