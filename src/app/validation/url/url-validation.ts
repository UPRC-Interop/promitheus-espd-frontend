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

import {AbstractControl} from "@angular/forms";
import {StringHelperService} from "../../services/string-helper.service";

const urlRegExp: RegExp = new RegExp("^(((http|HTTP|https|HTTPS|ftp|FTP|ftps|FTPS|sftp|SFTP)://)|((w|W){3}(\\d)?\\.))[\\w\\?!\\./:;,\\-_=#+*%@&quot;\\(\\)&amp;]+");

export function UrlValidation(control: AbstractControl): { [key: string]: boolean } | null {
  let url = control.value;
  if (StringHelperService.isBlank(url)) {
    return null;
  }
  if (!urlRegExp.test(url)) {
    return {
      'url': true
    }
  }
  return null;
}
