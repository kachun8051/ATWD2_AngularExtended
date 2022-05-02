import { HttpClient } from '@angular/common/http';
//import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
// import { timeStamp } from 'console';
// import { resolve } from 'dns';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BbqRecordMaster, BbqRecordDetail, BbqRecord, clsBbq } from '../BbqRecord.model';
import { ColumnFilter, ColumnItem } from './mytable.model';

@Component({
  selector: 'app-myexpandedtable',
  templateUrl: './myexpandedtable.component.html',
  styleUrls: ['./myexpandedtable.component.css']
})

export class MytableComponent implements OnInit {
  isloaded: boolean;
  // list of data
  listOfData: BbqRecord[];
  // list of master record i.e. the head row
  listOfMaster: BbqRecordMaster[];
  // list of list of detail record i.e. the line row
  listOfDetail: BbqRecordDetail[][];
  // table column header
  listOfColumns: ColumnItem[];
  // filter of district
  listOfDistrictFilter: ColumnFilter[];
  // http object
  http !: HttpClient;
  // edit data
  editData!: BbqRecord;
  // empty record is for add process
  emptyRecord: BbqRecord;
  // flag / indicator of showing modal
  modalIsVisible: boolean;
  modalTitle: string;
  // keyword for search
  keyword: string;
  // dialog
  confirmModal!: NzModalRef;
  modalService!: NzModalService;
  //serverData: String;
  //sortAgeFn = (a: DataItem, b: DataItem): number => a.age - b.age;
  /*
  districtFilterFn = (list: string[], item: BbqRecord): boolean => list.some(district => item.district.indexOf(district) !== -1);
  filterName = [
    { text: 'Joe', value: 'Joe' },
    { text: 'John', value: 'John' }
  ];
  */
  constructor(http: HttpClient, modal: NzModalService) { 
    console.log("mytable's constructor");
    this.isloaded = false;
    this.http = http;
    //this.confirmModal = modal;
    //this.serverData = "";
    this.listOfData = [];
    this.listOfMaster = [];
    this.listOfDetail = [];
    this.listOfColumns = [];
    this.listOfDistrictFilter = [];
    this.keyword = '';
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
    this.onload();    
  }

  async onsearch() {
    this.listOfData = [];
    this.listOfMaster = [];
    this.listOfDetail = [];
    this.listOfDistrictFilter = [];
    // sequence of data loading and filling:
    // 1. load the searched list of data for rows, fill the lists
    // 2 load the list of district, fill the lists 
    // 3. assign the listOfColumns 
    this.isloaded = false;
    //this.fillTheListOfColumns
    await this.getDistrict()
    .then( () => this.fillTheListOfColumns() )
    .then( () => this.getListSearchedData() )
    .then( () => {
      this.isloaded = true;
      console.log("isloaded is true.");
    });
  }

  async onload() {
    this.listOfData = [];
    this.listOfMaster = [];
    this.listOfDetail = [];
    this.listOfDistrictFilter = [];
    // sequence of data loading and filling:
    // 1. load the list of data for rows, fill the lists
    // 2 load the list of district, fill the lists 
    // 3. assign the listOfColumns 
    this.isloaded = false;
    //this.fillTheListOfColumns
    await this.getDistrict()
    .then( () => this.fillTheListOfColumns() )
    .then( () => this.getListData() )
    .then( () => {
      this.keyword = "";
      this.isloaded = true;
      console.log("isloaded is true.");
    });
    
  }

  fillTheListOfColumns() {
    this.listOfColumns = [
      {
        name: '',
        sortOrder: null,
        sortFn: null,
        listOfFilter: [],
        filterMultiple: false,
        filterFn: null
      },
      {
        name: 'GIHS',
        sortOrder: null,
        sortFn: (a: BbqRecordMaster, b: BbqRecordMaster) => a.GIHS.localeCompare(b.GIHS),
        listOfFilter: [],
        filterMultiple: false,
        filterFn: null
      },
      {
        name: 'Name',
        sortOrder: null,
        sortFn: (a: BbqRecordMaster, b: BbqRecordMaster) => a.name.localeCompare(b.name),
        listOfFilter: [],
        filterMultiple: false,
        filterFn: null
      },
      {
        name: 'District',
        sortOrder: null,
        sortFn: (a: BbqRecordMaster, b: BbqRecordMaster) => a.district.localeCompare(b.district),
        listOfFilter: this.listOfDistrictFilter,
        filterMultiple: true,        
        filterFn: (list: string[], item: BbqRecordMaster) => list.some(district => item.district.indexOf(district) !== -1)        
      },
      {
        name: 'Address',
        sortOrder: null,
        sortFn: (a: BbqRecordMaster, b: BbqRecordMaster) => a.address.localeCompare(b.address),        
        listOfFilter: [],
        filterMultiple: false,
        filterFn: null
      },
      {
        name: 'Phone',
        sortOrder: null,
        sortFn: (a: BbqRecordMaster, b: BbqRecordMaster) => a.phone.localeCompare(b.phone),        
        listOfFilter: [],
        filterMultiple: false,
        filterFn: null
      },
      {
        name: 'Opening_Hours',
        sortOrder: null,
        sortFn: (a: BbqRecordMaster, b: BbqRecordMaster) => a.hours.localeCompare(b.hours),        
        listOfFilter: [],
        filterMultiple: false,
        filterFn: null
      },
      {
        name: 'Edit',
        sortOrder: null,
        sortFn: null,        
        listOfFilter: [],
        filterMultiple: false,
        filterFn: null
      },
      {
        name: 'Delete',
        sortOrder: null,
        sortFn: null,        
        listOfFilter: [],
        filterMultiple: false,
        filterFn: null
      }
    ];
    console.log("listOfColumns is set.");
  }

  // custom funtion (fillData) 
  fillData(obj: Object): void {
    //this.serverData = arr;
    let objData = JSON.parse(JSON.stringify(obj));
    let serverDataArr = objData.data;
    let arrTmp = [];
    let arrMaster = [];
    let arrDetail = [];
    console.log("server data length: " + serverDataArr.length);
    // bbq in serverDataArr for-loop should be referred to actual json object 
    // but not BbqRecord model
    let i: number = 0;
    for (let bbq of serverDataArr) {
      // console.log(bbq.Name_en);
      let obj: BbqRecord = {
        GIHS: bbq.GIHS,
        name: bbq.Name_en,
        district: bbq.District_en.trim(),
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
        district: bbq.District_en.trim(),
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
      i += 1;
    }    
    this.listOfData = arrTmp;
    this.listOfMaster = arrMaster;
    this.listOfDetail = arrDetail;
    console.log("lists of data source are set.");
  }

  trackByName(_: number, item: ColumnItem): string {
    return item.name;
  }

  // custom function to search keyword
  async getListSearchedData(): Promise<boolean> {
    let myurl = "http://localhost/ATWD_Project_2021/controller.php/bbq/" + this.keyword;
    return new Promise(
      resolve => {
        this.http.get(myurl).subscribe({
          next: (res) => {
            // console.log(res);
            console.log("searched data (i.e. row data) is fetched successfully.");
            this.fillData(res);
            resolve(true);          
          },
          error: (err) => {
            console.log("Server call failed for searching: " + err);
            resolve(false);
          }
        });
      }
    );
  }

  // custom function to fetch data
  async getListData(): Promise<boolean> {
    
    let myurl = "http://localhost/ATWD_Project_2021/controller.php/dbinit";
    return new Promise(
      resolve => {
        this.http.get(myurl).subscribe(
          {      
            next: (res) => {
              // console.log(res);
              console.log("data (i.e. row data) is fetched successfully.");
              this.fillData(res);
              resolve(true);          
            },
            error: (err) => {
              console.log("Server call failed for fetching: " + err);
              resolve(false);
            }
          }
        );
      }
    );
  }
  // custom function to fetch district
  async getDistrict(): Promise<boolean> {
    
    let myurl = "http://localhost/ATWD_Project_2021/controller.php/barbecue/District_en";
    return new Promise(
      resolve => {
        this.http.get<any>(myurl).subscribe(
          {      
            next: (res) => {
              // console.log(res);
              console.log("data (i.e. district) is fetched successfully.");
              let objRes = res;
              if (objRes.issuccess == true) {
                let lstRes = objRes.data;
                for (let i = 0; i < lstRes.length; i++) {
                  // console.log(lstRes[i]);
                  this.listOfDistrictFilter.push({text: lstRes[i].trim(), value: lstRes[i].trim()});
                }
                resolve(true);
              } else {
                console.log("district cannot be fetched!");
                resolve(false);
              }                    
            },
            error: (err) => {
              console.log("Server call failed: " + err);
              resolve(false);
            }
          }
        );
      }
    ); 
  }

  // search keyword
  search() {
    console.log("keyword: " + this.keyword);
    if (this.keyword == '') {
      return;
    }
    this.onsearch();
  }

  // reset 
  reset() {
    console.log("reset is click.");
    this.onload();
  }

  // FIND 
  findBbq(gihs: string): BbqRecord {
    for (let i = 0; i < this.listOfData.length; i++) {
      if (this.listOfData[i].GIHS == gihs) {
        return this.listOfData[i];
      }
    }
    return this.emptyRecord;
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
    console.log("Edit2 is clicked");
    let foundBbq: BbqRecord = this.findBbq(gihs);
    if (foundBbq.GIHS == '') {
      console.log('Not found (edit): ' + gihs);
      return;
    } 
    this.editBbq(mTitle, foundBbq);
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
    console.log("Delete2 is clicked");
    let foundBbq: BbqRecord = this.findBbq(gihs);
    if (foundBbq.GIHS == '') {
      console.log('Not found (delete): ' + gihs);
      return;
    }
    this.deleteBbq(foundBbq);
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
