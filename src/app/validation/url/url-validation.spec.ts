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

import {UrlValidation} from "./url-validation";
import {FormControl} from "@angular/forms";

describe('UrlValidation', () => {
  it('should validate to error on random numbers', () => {
    let errors = UrlValidation(new FormControl('123456'));

    expect(errors).toEqual({'url': true});

  });
  it('should validate to error when not starting with valid url', () => {
    let errors = UrlValidation(new FormControl('__https://www.example.com'));

    expect(errors).toEqual({'url': true});

  });
  it('should not validate to error with valid url and subdomain', () => {
    let errors = UrlValidation(new FormControl('http://stash.ds.unipi.gr'));

    expect(errors).toBeNull();
  });
  it('should not validate to error with valid url', () => {
    let errors = UrlValidation(new FormControl('https://www.example.com'));

    expect(errors).toBeNull();
  });
  it('should not validate to error with valid url simap ted europa url', () => {
    let errors = UrlValidation(new FormControl('https://simap.ted.europa.eu/web/simap/standard-forms-for-public-procurement'));

    expect(errors).toBeNull();
  });
  it('should not validate to error with blank input string', () => {
    let errors = UrlValidation(new FormControl(' '));

    expect(errors).toBeNull();
  });
  it('should not validate to error with empty input string', () => {
    let errors = UrlValidation(new FormControl(''));

    expect(errors).toBeNull();
  });
  it('should not validate to error with null string', () => {
    let errors = UrlValidation(new FormControl(null));

    expect(errors).toBeNull();
  });
});
