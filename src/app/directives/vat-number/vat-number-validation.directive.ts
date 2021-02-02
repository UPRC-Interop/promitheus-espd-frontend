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

import {Directive, forwardRef} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from "@angular/forms";
import {VatNumberValidation} from "../../validation/vat-number/vat-number-validation";

@Directive({
  selector: '[vatNumber]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => VatNumberValidationDirective), multi: true}
  ]
})
export class VatNumberValidationDirective implements Validator {

  constructor() {
  }

  validate(c: AbstractControl): { [key: string]: any } {
    return VatNumberValidation(c);
  }
}
