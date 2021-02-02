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

import {PostalAddress} from './postalAddress.model';
import {ContactingDetails} from './contactingDetails.model';

export class Cadetails {
  procurementProcedureTitle: string;
  procurementProcedureDesc: string;
  procurementProcedureFileReferenceNo: string;
  procurementPublicationNumber: string;
  procurementProjectLots?: number;
  electronicAddressID?: string;
  webSiteURI?: string;
  postalAddress?: PostalAddress;
  contactingDetails?: ContactingDetails;
  procurementPublicationURI: string;
  id: string;
  caofficialName: string;
  cacountry: string;
  receivedNoticeNumber?: string;
  nationalOfficialJournal?: string;
  procurementProcedureType?: string;
  classificationCodes?: string[];
  procedureType?: string;
  projectType?: string;
  weightingType?: string;
  weightScoringMethodologyNote?: string;
}
