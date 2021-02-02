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

import {LegislationReference} from './legislationReference.model';
import {RequirementGroup} from './requirementGroup.model';
import {RequirementResponse} from './requirement-response.model';
import {PropertyKeyMap} from './propertyKeyMap.model';
import {ECertisCriterion} from './eCertisCriterion.model';

export class FullCriterion {
  type: string;
  typeCode: string;
  name: string;
  description: string;
  selected: boolean;
  legislationReference: LegislationReference;
  requirementGroups: RequirementGroup[];
  id: string;
  uuid: string;
  subCriterionList?: ECertisCriterion[];
  criterionGroup: string;
  ruleset?: string;
  response?: RequirementResponse;
  propertyKeyMap: PropertyKeyMap;
  compulsory?: boolean;
}
