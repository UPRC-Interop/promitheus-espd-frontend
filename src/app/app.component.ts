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

import {Component, OnInit} from '@angular/core';
import {DataService} from './services/data.service';
import {TranslateService} from '@ngx-translate/core';
import {Language} from './model/language.model';
import {PlatformInfo} from "./model/platform-info";
import {ApicallService} from "./services/apicall.service";
import {environment} from '../environments/environment';


// import {NgForm, FormControl} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLinear = true;
  language: Language[];
  platformInfo: PlatformInfo = null;
  platformInfoUrl: String = environment.apiUrl + 'platform-info';


  constructor(public dataService: DataService, public translate: TranslateService, private APIService: ApicallService) {
    // translate.setDefaultLang('ESPD_en');
    // translate.setDefaultLang('ESPD_de');
    // console.log(this.translate.getLangs());

  }

  ngOnInit() {
    this.APIService.getPlatformInfo().then(res => {
      this.platformInfo = res;
      console.log(this.platformInfo);
    }).catch(err => console.log(err));
  }

  // switchLanguage(language: string) {
  //   this.translate.use(language);
  // }
}
