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

import {AbstractControl} from '@angular/forms';
import {StringHelperService} from '../../services/string-helper.service';

const numberOjsRegExp: RegExp = new RegExp(
  '^(0000/S 000-000000|((19|20)\\d{2}/S \\d{3}-\\d{6}))$'
);

export function NumberOjsValidation(control: AbstractControl): { [key: string]: boolean } | null {

  const numberOjs = control.value;

  if (StringHelperService.isBlank(numberOjs)) {
    return null;
  }

  if (!numberOjsRegExp.test(numberOjs)) {
    return {
      'numberOjs': true
    };
  }

  return null;

}
