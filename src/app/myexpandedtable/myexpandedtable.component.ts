import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BbqRecordMaster, BbqRecordDetail, BbqRecord, clsBbq } from '../BbqRecord.model';

@Component({
  selector: 'app-myexpandedtable',
  templateUrl: './myexpandedtable.component.html',
  styleUrls: ['./myexpandedtable.component.css']
})

export class MytableComponent implements OnInit {
  listOfData: BbqRecord[];
  // list of master record i.e. the head row
  listOfMaster: BbqRecordMaster[];
  // list of list of detail record i.e. the line row
  listOfDetail: BbqRecordDetail[][];
  http !: HttpClient;
  // edit data
  editData!: BbqRecord;
  // empty record is for add process
  emptyRecord: BbqRecord;
  // flag / indicator of showing modal
  modalIsVisible: boolean;
  modalTitle: string;
  // dialog
  confirmModal!: NzModalRef;
  modalService!: NzModalService;
  //serverData: String;
  //sortAgeFn = (a: DataItem, b: DataItem): number => a.age - b.age;
  nameFilterFn = (list: string[], item: BbqRecord): boolean => list.some(name => item.name.indexOf(name) !== -1);
  filterName = [
    { text: 'Joe', value: 'Joe' },
    { text: 'John', value: 'John' }
  ];

  constructor(http: HttpClient, modal: NzModalService) { 
    console.log("mytable's constructor");
    this.http = http;
    //this.confirmModal = modal;
    //this.serverData = "";
    this.listOfData = [];
    this.listOfMaster = [];
    this.listOfDetail = [];
    this.modalIsVisible = false;
    this.modalService = modal;
    // empty record for add process
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
    } 
    this.modalTitle = '';
  }

  ngOnInit(): void {
    
    this.listOfData = [];
    this.getListData();
  }

  // custom funtion (fillData) 
  fillData(arr: Object): void {
    //this.serverData = arr;
    let objData = JSON.parse(JSON.stringify(arr));
    let serverDataArr = objData.data;
    let arrTmp = [];
    let arrMaster = [];
    let arrDetail = [];
    console.log(serverDataArr.length);
    // bbq in serverDataArr for-loop should be referred to actual json object 
    // but not BbqRecord model
    let i: number = 0;
    for (let bbq of serverDataArr) {
      console.log(bbq.Name_en);
      let obj: BbqRecord = {
        GIHS: bbq.GIHS,
        name: bbq.Name_en,
        district: bbq.District_en,
        address: bbq.Address_en,
        facilities: bbq.Facilities_en,
        ancillary: bbq.Ancillary_facilities_en,
        hours: bbq.Opening_hours_en,
        phone: bbq.Phone,
        remarks: bbq.Remarks_en,
        longitude: bbq.Longitude,
        latitude: bbq.Latitude
      };
      let objMaster: BbqRecordMaster = {
        id: i,
        GIHS: bbq.GIHS,
        name: bbq.Name_en,
        district: bbq.District_en,
        address: bbq.Address_en,
        hours: bbq.Opening_hours_en,
        phone: bbq.Phone,
        longitude: bbq.Longitude,
        latitude: bbq.Latitude,
        isexpand: false,
      };
      let objDetail: BbqRecordDetail = {
        id: 0, // only one line
        GIHS: bbq.GIHS,
        facilities: bbq.Facilities_en,
        ancillary: bbq.Ancillary_facilities_en,
        remarks: bbq.Remarks_en
      };
      arrTmp.push(obj);
      arrMaster.push(objMaster);
      arrDetail.push([objDetail]);
      i = i + 1;
    }    
    this.listOfData = arrTmp;
    this.listOfMaster = arrMaster;
    this.listOfDetail = arrDetail;
    console.log("data sources are set.");
  }

  // custom function to fetch data
  getListData() {
    let myurl = "http://localhost/ATWD_Project_2021/controller.php/dbinit"
    this.http.get(myurl).subscribe(
      {      
        next: (res) => {
          // console.log(res);
          console.log("data is fetched successfully.");
          this.fillData(res);          
        },
        error: (err) => {
          console.log("Server call failed: " + err);
        }
      }
    );
  }

  // INSERT
  addBbq(mTitle: string) {
    console.log("Add is clicked")
    this.editData = this.emptyRecord;
    this.modalIsVisible = true;
    this.modalTitle = mTitle;
  }
  // UPDATE for expanded table
  editBbq2(mTitle: string, gihs: string) {

  }

  // UPDATE
  editBbq(mTitle: string, data: BbqRecord) {
    console.log("Edit is clicked");
    //console.log(JSON.stringify(data));    
    this.editData = data;    
    this.modalIsVisible = true;
    this.modalTitle = mTitle;
  }

  // DELETE for expanded table
  deleteBbq2(gihs: string) {

  }

  // DELETE
  deleteBbq(data: BbqRecord) {
    console.log("Delete is clicked");
    let obj = new clsBbq();
    obj.setBbqRecord(data);
    let content = obj.getBbqRecord();
    //return;
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Alert',
      nzContent: 'Confirm to delete?<br/>' + content,
      nzOkText: 'Delete',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        let url = "http://localhost/ATWD_Project_2021/controller.php/barbecue/GIHS/"
        this.http.delete(url + data['GIHS']).subscribe({
          next: (res) => {      
            console.log("Delete success.")      
            this.getListData();        
          },
          error: (err) => {
            console.log("Delete error" + err);
          }
        });
      }
    });    
  }

  // callback when add or edit completed
  clickEvent() {
    console.log("clickEvent (callback).");
    this.getListData();
  }


}
