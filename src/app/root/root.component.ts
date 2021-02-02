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

import {Component, OnChanges, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {UtilitiesService} from '../services/utilities.service';
import {Title} from '@angular/platform-browser';
import {StartComponent} from '../start/start.component';
import {ProcedureComponent} from '../procedure/procedure.component';
import {ProcedureEoComponent} from '../procedure-eo/procedure-eo.component';
import {ExclusionComponent} from '../exclusion/exclusion.component';
import {ExclusionEoComponent} from '../exclusion-eo/exclusion-eo.component';
import {SelectionEoComponent} from '../selection-eo/selection-eo.component';
import {FinishComponent} from '../finish/finish.component';
import {FinishEoComponent} from '../finish-eo/finish-eo.component';
import {SelectionComponent} from '../selection/selection.component';
import {WizardSteps} from '../base/wizard-steps.enum';
import {Location} from '@angular/common';
import {MatHorizontalStepper, MatStepper} from '@angular/material';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('startComponent') startComponent: StartComponent;
  @ViewChild('procedureCaComponent') procedureCaComponent: ProcedureComponent;
  @ViewChild('procedureEoComponent') procedureEoComponent: ProcedureEoComponent;
  @ViewChild('exclusionCaComponent') exclusionCaComponent: ExclusionComponent;
  @ViewChild('exclusionEoComponent') exclusionEoComponent: ExclusionEoComponent;
  @ViewChild('selectionCaComponent') selectionCaComponent: SelectionComponent;
  @ViewChild('selectionEoComponent') selectionEoComponent: SelectionEoComponent;
  @ViewChild('finishCaComponent') finishCaComponent: FinishComponent;
  @ViewChild('finishEoComponent') finishEoComponent: FinishEoComponent;
  @ViewChild('stepper') stepper: MatHorizontalStepper;

  startStepValid: boolean;
  procedureStepValid: boolean;
  exclusionStepValid: boolean;
  selectionStepValid: boolean;
  finishStepValid: boolean;

  isLinear = true;
  elTitle = 'Π�?ομηθε�?ς ESPDint – ηλεκτ�?ονική υπη�?εσία σ�?νταξης του Ενιαίου Ευ�?ωπα�?κο�? Εγγ�?άφου Σ�?μβασης (ΕΕΕΣ)';
  enTitle = 'Promitheus ESPDint – e-Service to fill out the European Single Procurement Document (ESPD)';


  constructor(public dataService: DataService,
              public utilities: UtilitiesService, private titleService: Title,
              public location: Location, public router: Router) {

  }

  ngOnInit() {
    this.startStepValid = true;
    this.procedureStepValid = true;
    this.exclusionStepValid = true;
    this.selectionStepValid = true;
    this.finishStepValid = true;


  }

  ngAfterViewInit(): void {

  }

  ngOnChanges() {
  }

  onLanguageSelection(language: string) {
    // console.log(language);

    this.utilities.initLanguage = false;
    this.utilities.start = true;
    this.setTitle(this.utilities.selectedLang);
    this.dataService.switchLanguage(language);
  }

  setTitle(lang: string) {
    const title = (lang === 'el' ? this.elTitle : this.enTitle);
    this.titleService.setTitle(title);
  }


  private validateSteps(event) {
    let isCA = this.startComponent.isCA;
    this.startStepValid = event.selectedIndex === WizardSteps.START || this.startComponent.areFormsValid();
    this.procedureStepValid = event.selectedIndex === WizardSteps.PROCEDURE || RootComponent.isComponentValid(isCA ? this.procedureCaComponent : this.procedureEoComponent);
    this.exclusionStepValid = event.selectedIndex === WizardSteps.EXCLUSION || RootComponent.isComponentValid(isCA ? this.exclusionCaComponent : this.exclusionEoComponent);
    this.selectionStepValid = event.selectedIndex === WizardSteps.SELECTION || RootComponent.isComponentValid(isCA ? this.selectionCaComponent : this.selectionEoComponent);
    this.finishStepValid = event.selectedIndex === WizardSteps.FINISH || RootComponent.isComponentValid(isCA ? this.finishCaComponent : this.finishEoComponent);


  }

  changeURL() {
    if (this.stepper.selectedIndex === WizardSteps.START) {
      this.location.go('/#/start');
      // this.moveStep(0);
    } else if (this.stepper.selectedIndex === WizardSteps.PROCEDURE) {
      this.location.go('/#/procedure');
      // this.moveStep(1);
    } else if (this.stepper.selectedIndex === WizardSteps.EXCLUSION) {
      this.location.go('/#/exclusion');
      // this.moveStep(2);
    } else if (this.stepper.selectedIndex === WizardSteps.SELECTION) {
      this.location.go('/#/selection');
      // this.moveStep(3);
    } else if (this.stepper.selectedIndex === WizardSteps.FINISH) {
      this.location.go('/#/finish');
      // this.moveStep(4);
    }

    this.router.events.subscribe(value => {
      console.log(value);

      if (value instanceof NavigationEnd) {
        // console.log('ROUTER CHANGED');
        // console.log(value);
        // console.log(value.url);
        if (value.url === '/#/start') {
          this.stepper.selectedIndex = WizardSteps.START;
        } else if (value.url === '/#/procedure') {
          this.stepper.selectedIndex = WizardSteps.PROCEDURE;
        } else if (value.url === '/#/exclusion') {
          this.stepper.selectedIndex = WizardSteps.EXCLUSION;
        } else if (value.url === '/#/selection') {
          this.stepper.selectedIndex = WizardSteps.SELECTION;
        } else if (value.url === '/#/finish') {
          this.stepper.selectedIndex = WizardSteps.FINISH;
        }


      }

    });
  }


  private static isComponentValid(component) {
    return 'undefined' === typeof component || component.areFormsValid();
  }
}
