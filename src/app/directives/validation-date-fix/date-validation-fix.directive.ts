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

import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {AbstractControl} from "@angular/forms";
import {StringHelperService} from "../../services/string-helper.service";

/**
 * This directive is a workaround for this angular material bug: https://github.com/angular/material2/issues/13346
 */

@Directive({
  selector: '[appDateValidationFix]'
})
export class DateValidationFixDirective {

  @Input('appDateValidationFix') formControl: AbstractControl;

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('blur') onFocusLost() {
    let nativeElementValue = this.elementRef.nativeElement.value;
    if ((this.formControl.value === null || this.formControl.value === "") && !StringHelperService.isBlank(nativeElementValue)) {
      this.formControl.setErrors({'matDatepickerParse': true});
    } else {
      if (this.formControl.hasError('matDatepickerParse')) {
        delete this.formControl.errors['matDatepickerParse'];
        this.formControl.updateValueAndValidity();
      }
    }
  }
}
