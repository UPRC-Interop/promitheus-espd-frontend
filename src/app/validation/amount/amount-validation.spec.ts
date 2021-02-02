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

import {FormControl} from "@angular/forms";
import {AmountValidation} from "./amount-validation";

describe('AmountValidation', () => {
  it('should not validate to error on positive number', () => {
    let errors = AmountValidation(new FormControl('123456'));

    expect(errors).toBeNull();
  });
  it('should not validate to error on positive number', () => {
    let errors = AmountValidation(new FormControl('123456'));

    expect(errors).toBeNull();
  });
  it('should not validate to error with plus sign before number', () => {
    let errors = AmountValidation(new FormControl('+5'));

    expect(errors).toBeNull();
  });
  it('should not validate to error with plus minus before number', () => {
    let errors = AmountValidation(new FormControl('-5'));

    expect(errors).toBeNull();
  });
  it('should not validate to error on floating point number', () => {
    let errors = AmountValidation(new FormControl('5.0'));

    expect(errors).toBeNull();
  });
  it('should not validate to error on negativ floating point number', () => {
    let errors = AmountValidation(new FormControl('-5.0'));

    expect(errors).toBeNull();
  });
  it('should not validate to error on positive floating point number', () => {
    let errors = AmountValidation(new FormControl('+5.0'));

    expect(errors).toBeNull();
  });
  it('should not validate to error on floating point number with two', () => {
    let errors = AmountValidation(new FormControl('5.00'));

    expect(errors).toBeNull();
  });
  it('should validate to error on floating point number with three', () => {
    let errors = AmountValidation(new FormControl('5.000'));

    expect(errors).toEqual({'amount': true});
  });
  it('should validate to error on literal', () => {
    let errors = AmountValidation(new FormControl('f'));

    expect(errors).toEqual({'amount': true});
  });
  it('should not validate to error with empty string', () => {
    let errors = AmountValidation(new FormControl(' '));

    expect(errors).toBeNull();
  });
});
