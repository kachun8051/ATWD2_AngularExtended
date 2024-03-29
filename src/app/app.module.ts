import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MytableComponent } from './myexpandedtable/myexpandedtable.component';
import { MymodelComponent } from './mymodal/mymodal.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MymapComponent } from './mymap/mymap.component';
import { MymapmodalComponent } from './mymapmodal/mymapmodal.component'


registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    MytableComponent,
    MymodelComponent,
    MymapComponent,
    MymapmodalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    CommonModule,
    BrowserAnimationsModule,
    NzTableModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    NzBadgeModule,
    NzDropDownModule,
    NzDividerModule,
    FormsModule,
    NzCardModule,
    NzInputModule,
    NzIconModule,
    ReactiveFormsModule,
    GoogleMapsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule { }
