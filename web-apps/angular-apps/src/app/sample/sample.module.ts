import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter, Routes } from '@angular/router';
import { ToolboxComponent } from './toolbox/toolbox.component';
import { HomeComponent } from './home/home.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { PeriodicTableComponent } from './periodic-table/periodic-table.component';
import { MaterialComponent } from './material/material.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'material',
    component: MaterialComponent
  },
  {
    path: 'periodic-table',
    component: PeriodicTableComponent
  },
  {
    path: 'toolbox',
    component: ToolboxComponent
  },
  {
    path: 'tutorial',
    component: TutorialComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    provideRouter(routes)
  ]
})
export class SampleModule { }
