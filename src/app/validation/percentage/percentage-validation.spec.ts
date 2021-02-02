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

import {PercentageValidation} from "./percentage-validation";
import {FormControl} from "@angular/forms";

describe('PercentageValidation', () => {
  it('should validate error for strings', () => {
    let errors = PercentageValidation(new FormControl('abc'));
    expect(errors).toEqual({percentage: true});
  });

  it('should validate error for non float value', () => {
    let errors = PercentageValidation(new FormControl('1,23'));
    expect(errors).toEqual({percentage: true});
  });

  it('should validate error for negative percent', () => {
    let errors = PercentageValidation(new FormControl('-101'));
    expect(errors).toEqual({percentage: true});
  });

  it('should validate error for more then 100 percent', () => {
    let errors = PercentageValidation(new FormControl('101'));
    expect(errors).toEqual({percentage: true});
  });

  it('should not validate error for float value', () => {
    let errors = PercentageValidation(new FormControl('1.23'));
    expect(errors).toBeNull();
  });

  it('should validate error for mor then 100 percent in decimal', () => {
    let errors = PercentageValidation(new FormControl('100.000001'));
    expect(errors).toEqual({percentage: true});
  });

  it('should not validate error for 100 percent', () => {
    let errors = PercentageValidation(new FormControl('100'));
    expect(errors).toBeNull();
  });

  it('should not validate error for zero percent', () => {
    let errors = PercentageValidation(new FormControl('0'));
    expect(errors).toBeNull();
  });

  it('should not validate error for int value', () => {
    let errors = PercentageValidation(new FormControl('1'));
    expect(errors).toBeNull();
  });
});
