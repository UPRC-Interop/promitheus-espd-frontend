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

import {Component, Input} from '@angular/core';
import {ValidationErrors} from '@angular/forms';

@Component({
  selector: 'input-validation-error',
  templateUrl: './input-validation-error.component.html',
  styleUrls: ['./input-validation-error.component.css']
})
export class InputValidationErrorComponent {

  @Input() formControlErrors: ValidationErrors;

  constructor() {
  }

  getValidationErrorsMessage(errors: ValidationErrors) {
    let validationErrors: string[] = Object.keys(errors);

    return this.getValidationErrorMessageKey(validationErrors[0]);
  }

  getValidationErrorMessageKey(validation: String): string {
    return `espd.validator.${validation}`;
  }


}
