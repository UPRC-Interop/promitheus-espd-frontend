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

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RootComponent} from './root.component';
import {MaterialModule} from "../material/material.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {ProcedureComponent} from "../procedure/procedure.component";
import {ProcedureEoComponent} from "../procedure-eo/procedure-eo.component";
import {SelectionEoComponent} from "../selection-eo/selection-eo.component";
import {SelectionComponent} from "../selection/selection.component";
import {FinishComponent} from "../finish/finish.component";
import {FinishEoComponent} from "../finish-eo/finish-eo.component";
import {ExclusionEoComponent} from "../exclusion-eo/exclusion-eo.component";
import {ExclusionComponent} from "../exclusion/exclusion.component";
import {WelcomeComponent} from "../welcome/welcome.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CriterionComponent} from "../criterion/criterion.component";
import {RequirementGroupComponent} from "../requirement-group/requirement-group.component";
import {AppComponent} from "../app.component";
import {ToolbarComponent} from "../toolbar/toolbar.component";
import {RequirementComponent} from "../requirement/requirement.component";
import {AppRoutingModule} from "../app-routing.module";
import {ApicallService} from "../services/apicall.service";
import {DataService} from "../services/data.service";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";
import {HttpLoaderFactory} from "../app.module";
import {DebugElement} from "@angular/core";
import {StartComponent} from "../start/start.component";

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
        FinishEoComponent
      ],
      imports: [
        MaterialModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [ApicallService, DataService,
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
      ]
    })
    .compileComponents()
    .then(() => {


      fixture = TestBed.createComponent(RootComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
