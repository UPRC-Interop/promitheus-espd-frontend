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

import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AbstractControl} from "@angular/forms";

@Directive({
  selector: '[validationError]'
})
export class ValidationErrorDirective {

  valid:boolean = true;
  formControl: AbstractControl;

  @Input() set validationError(formControl: AbstractControl) {
    console.log("show");
    this.formControl = formControl;
    formControl.statusChanges.subscribe( val => {
      // console.log(`${val}`);
      // if(val === 'VALID' && !this.valid) {
      //   this.vcRef.clear();
      //   this.valid = true;
      // }
      // else if(val === 'INVALID' && this.valid) {
      //   this.vcRef.createEmbeddedView(this.templateRef);
      //   this.valid = false;
      // }
    });

    formControl.valueChanges.subscribe(value => {
      console.log(`${value}`);
      if(this.formControl.dirty && this.formControl.invalid && this.valid) {
        this.vcRef.createEmbeddedView(this.templateRef);
        this.valid = false;
        console.log("invalid -> show!");
      }
      else if(this.formControl.dirty && this.formControl.valid && !this.valid) {
        this.vcRef.clear();
        this.valid = true;
        console.log("valid -> hide!");
      }
    })
  }

  constructor(private templateRef: TemplateRef<any>, private vcRef: ViewContainerRef) {

  }


}
