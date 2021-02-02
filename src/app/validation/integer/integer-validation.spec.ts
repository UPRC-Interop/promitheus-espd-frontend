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
import {IntegerValidation} from "./integer-validation";

describe('IntegerValidation', () => {
  it('should not validate to error on positive number', () => {
    let errors = IntegerValidation(new FormControl('123456'));

    expect(errors).toBeNull();
  });
  it('should validate to error with plus sign before number', () => {
    let errors = IntegerValidation(new FormControl('+5'));

    expect(errors).toEqual({'number': true});
  });
  it('should validate to error with plus minus before number', () => {
    let errors = IntegerValidation(new FormControl('-5'));

    expect(errors).toEqual({'number': true});
  });
  it('should validate to error on floating point number', () => {
    let errors = IntegerValidation(new FormControl('5.0'));

    expect(errors).toEqual({'number': true});
  });
  it('should validate to error on literal', () => {
    let errors = IntegerValidation(new FormControl('f'));

    expect(errors).toEqual({'number': true});
  });
  it('should not validate to error with empty string', () => {
    let errors = IntegerValidation(new FormControl(' '));

    expect(errors).toBeNull();
  });
});
