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
import {VatNumberValidation} from "./vat-number-validation";
import {PhoneNumberValidation} from "../phone-number/phone-number-validation";

describe('VatNumberValidation', () => {
  it('should not validate to error on numbers', () => {
    let errors = VatNumberValidation(new FormControl('0123456789'));

    expect(errors).toBeNull();
  });
  it('should not validate to error on valid german vat idenification number', () => {
    let errors = VatNumberValidation(new FormControl('DE262044136'));

    expect(errors).toBeNull();
  });
  it('should not validate to error on valid german vat idenification number with space', () => {
    let errors = VatNumberValidation(new FormControl('DE 262 044 136'));

    expect(errors).toBeNull();
  });
  it('should not validate to error on upper case literals', () => {
    let errors = VatNumberValidation(new FormControl('ABCDEFGHIJKLMNOPQRSTUVWXYZ'));

    expect(errors).toBeNull();
  });
  it('should validate to error on lower case literals', () => {
    let errors = VatNumberValidation(new FormControl('abcdefghijklmnopqrstuvwxyz'));

    expect(errors).toEqual({'vatNumber': true});
  });
  it('should validate to error on special characters', () => {
    let errors = VatNumberValidation(new FormControl('°^!"§$%&/()=?`{}[],;.:-_#+~*<>|'));

    expect(errors).toEqual({'vatNumber': true});
  });
  it('should not validate to error with blank string', () => {
    let errors = PhoneNumberValidation(new FormControl(' '));

    expect(errors).toBeNull();
  });
});
