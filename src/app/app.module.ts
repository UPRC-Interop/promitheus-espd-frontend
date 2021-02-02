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

import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {NgxLoadingModule} from 'ngx-loading';

import {DataService} from './services/data.service';
import {ApicallService} from './services/apicall.service';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import {AppComponent} from './app.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {StartComponent} from './start/start.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {ProcedureComponent} from './procedure/procedure.component';
import {ExclusionComponent} from './exclusion/exclusion.component';
import {ProcedureEoComponent} from './procedure-eo/procedure-eo.component';
import {SelectionComponent} from './selection/selection.component';
import {FinishComponent} from './finish/finish.component';
import {ExclusionEoComponent} from './exclusion-eo/exclusion-eo.component';
import {SelectionEoComponent} from './selection-eo/selection-eo.component';
import {RequirementGroupComponent} from './requirement-group/requirement-group.component';
import {RequirementComponent} from './requirement/requirement.component';
import {RootComponent} from './root/root.component';
import {CriterionComponent} from './criterion/criterion.component';
import {FinishEoComponent} from './finish-eo/finish-eo.component';
/* translations */
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NumberOjsValidationDirective} from './directives/number-ojs/number-ojs-validation.directive';
import {InputValidationErrorComponent} from './shared/input-validation-error/input-validation-error.component';
import {ValidationErrorDirective} from './directives/validation-error/validation-error.directive';
import {UrlValidationDirective} from './directives/url/url-validation.directive';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateValidationFixDirective} from './directives/validation-date-fix/date-validation-fix.directive';
import {PhoneNumberValidationDirective} from './directives/phone-number/phone-number-validation.directive';
import {IntegerValidationDirective} from './directives/integer/integer-validation.directive';
import {PercentageValidationDirective} from './directives/percentage/percentage-validation.directive';
import {VatNumberValidationDirective} from './directives/vat-number/vat-number-validation.directive';
import {AmountDirective} from './directives/amount/amount.directive';
import {ECertisCriterionComponent} from './e-certis-criterion/e-certis-criterion.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    StartComponent,
    WelcomeComponent,
    ProcedureComponent,
    ExclusionComponent,
    ProcedureEoComponent,
    SelectionComponent,
    FinishComponent,
    ExclusionEoComponent,
    SelectionEoComponent,
    RequirementGroupComponent,
    RequirementComponent,
    RootComponent,
    CriterionComponent,
    FinishEoComponent,
    NumberOjsValidationDirective,
    UrlValidationDirective,
    InputValidationErrorComponent,
    ValidationErrorDirective,
    DateValidationFixDirective,
    PhoneNumberValidationDirective,
    IntegerValidationDirective,
    PercentageValidationDirective,
    VatNumberValidationDirective,
    AmountDirective,
    ECertisCriterionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxLoadingModule.forRoot({}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [ApicallService, DataService, Title, Location,
    {provide: MAT_DATE_LOCALE, useValue: 'el-GR'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

/* required for AOT */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
