import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BbqRecord } from '../BbqRecord.model';

@Component({
  selector: 'app-mymodal',
  templateUrl: './mymodal.component.html',
  styleUrls: ['./mymodal.component.css']
})

export class MymodelComponent implements OnInit {
  // isVisible = false;
  @Input()
  title: string;
  @Input()
  okText: string = "ok";
  @Input()
  cancelText: string = "cancel" ;
  @Input()
  data: BbqRecord;
  @Input()
  isVisible: boolean; // flag or indicator whether showing modal
  @Output()
  isVisibleChange = new EventEmitter<any>(); 
  @Output()
  clickEvent = new EventEmitter<string>();

  isEdit: boolean;
  validateForm: FormGroup;
  //modalTitle: string;
  http !: HttpClient;
  emptyRecord: BbqRecord;

  constructor(fb: FormBuilder, http: HttpClient) {
    console.log("mymodal's constructor");
    this.validateForm = fb.group({
      GIHS: [null],
      name: [null, [Validators.required, Validators.minLength(5)]],
      district: [null, [Validators.required, Validators.minLength(5)]],
      address: [null, [Validators.required, Validators.minLength(10)]],
      longitude: [null, [Validators.required, Validators.pattern("^-{0,1}[0-9]{1,3}-[0-9]{1,2}-[0-9]{1,2}$")]],
      latitude: [null, [Validators.required, Validators.pattern("^-{0,1}[0-9]{1,2}-[0-9]{1,2}-[0-9]{1,2}$")]]
    });
    this.http = http;
    this.emptyRecord = {
      GIHS: '',
      name: '',
      district: '',
      address: '',
      facilities: '',
      ancillary: '',
      hours: '',
      phone: '',
      remarks: '',
      longitude: '',
      latitude: ''
    };
    this.data = this.emptyRecord;
    this.isVisible = false;
    this.isEdit = false;
    this.title = '';
    //this.modalTitle = '';
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.data == undefined) {
      return;
    }
    console.log("mymodal.ngOnChanges");
    //console.log("data input from mytable: " + JSON.stringify(this.data));
    console.log("GIHS: " + this.data['GIHS']);;
    if (this.data['GIHS'] !== '') {
      this.isEdit = true; 
    } else {
      this.isEdit = false;      
    }
    this.validateForm.setValue({
      GIHS: this.data['GIHS'],
      name: this.data['name'],
      district: this.data['district'],
      address: this.data['address'],
      longitude: this.data['longitude'],
      latitude: this.data['latitude']
    });
  }

  assignObject(objTarget: Record<string, unknown>, key: string, val: string){
    switch (key){
      case 'GIHS':
        objTarget['GIHS'] = val;
        break;
      case 'name':
        objTarget['Name_en'] = val;
        break;
      case 'district':
        objTarget['District_en'] = val;
        break;
      case 'address':
        objTarget['Address_en'] = val;
        break;
      case 'longitude':
        objTarget['Longitude'] = val;
        break;
      case 'latitude':
        objTarget['Latitude'] = val;
        break;
      default:
        objTarget['unknown'] = val;
    }     
  }

  submitForm(): void {
    //let params = {};
    let params: Record<string, unknown> = {};
    //let objTmp = {};
    for (const key in this.validateForm.controls){
      // console.log("submit form - key: " + key);
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
      if (!(this.validateForm.controls[key].status == 'VALID') && this.validateForm.controls[key].status !== 'DISABLED') {
        console.log("key: " + key + " Not validated!");
        return;
      }
      if (this.validateForm.controls[key] && this.validateForm.controls[key].value) {
        let currValue = this.validateForm.controls[key].value;
        console.log("key: value: " +  `${key}: ${currValue}`);
        this.assignObject(params, key, currValue);
      } else {
        console.log("key: value: " +  `${key}: ${''}`);
        this.assignObject(params, key, '')
      }
    }
    console.log("submitting: " + JSON.stringify(params));
    let url = "http://localhost/ATWD_Project_2021/controller.php/barbecue"; 
    if (this.isEdit) {   
      console.log("before put.");   
      this.http.put(url, params).subscribe({
        next: (res) => {            
          this.clickEvent.emit(JSON.stringify({isdataload: true, msg: 'Edit success.'}));
          this.isVisibleChange.emit(false);
        },
        error: (err) => {
          console.log("Edit error" + err);
          this.clickEvent.emit(JSON.stringify({isdataload: false, msg: 'Edit error'}));
        }
      });
    } 
    else {
      console.log("before post.");
      this.http.post(url, params).subscribe({
        next: (res) => {
          this.clickEvent.emit(JSON.stringify({isdataload: true, msg: "Insert success"}));
          this.isVisibleChange.emit(false);
        },
        error: (err) => {
          console.log("Insert error" + err);
          this.clickEvent.emit(JSON.stringify({isdataload: false, msg: 'Insert error.'}));
        }
      });
    }
  }
/*
  showModal(): void {
    this.isVisible = true;
    this.title = 'The first Modal';
  }
*/
  handleOk(): void {
    console.log('handleOk is called');
    this.clickEvent.emit(JSON.stringify({isdataload: false, msg: 'Button ok clicked.'}));
    this.submitForm();
  }

  handleCancel(): void {
    console.log('handleCancel is called');
    this.clickEvent.emit(JSON.stringify({isdataload: false, msg: 'Button cancel clicked.'}));
    this.isVisibleChange.emit(false);
  }
}