// for table master row
interface BbqRecordMaster {
    id: number,
    GIHS: string,
    name: string,
    district: string,    
    address: string,
    phone: string,
    hours: string,        
    longitude: string,
    latitude: string,
    isexpand: boolean
}
// for table expanded detail row
interface BbqRecordDetail {
    id: number,
    GIHS: string,
    facilities: string,
    ancillary: string,
    remarks: string,
}

interface BbqRecord {
    GIHS: string,
    name: string,
    district: string,    
    address: string,
    phone: string,
    hours: string, 
    facilities: string,
    ancillary: string,
    remarks: string,
    longitude: string,
    latitude: string    
}

class clsBbq implements BbqRecord { 
    GIHS: string
    name: string
    district: string    
    address: string
    phone: string
    hours: string 
    facilities: string
    ancillary: string
    remarks: string
    longitude: string
    latitude: string

    constructor() { 
        this.GIHS = '';
        this.name = '';
        this.district = '';
        this.address = '';
        this.phone = '';
        this.hours = ''; 
        this.facilities = '';
        this.ancillary = '';
        this.remarks = '';
        this.longitude = '';
        this.latitude = '';
    }

    setBbqRecord(bbq: BbqRecord) {
        this.GIHS = bbq.GIHS;
        this.name = bbq.name;
        this.district = bbq.district;
        this.address = bbq.address;
        this.phone = bbq.phone;
        this.hours = bbq.hours;
        this.facilities = bbq.facilities;
        this.ancillary = bbq.ancillary;
        this.remarks = bbq.remarks;
        this.longitude = bbq.longitude;
        this.latitude = bbq.latitude;
    }

    getBbqRecord():String {
        let strHtml = '<table>';
        strHtml += '<tr><td>GIHS:</td><td>' + this.GIHS + '</td></tr>' + 
            '<tr><td>Name:</td><td>' + this.name + '</td></tr>' +
            '<tr><td>District:</td><td>' + this.district + '</td></tr>' +
            '<tr><td>Address:</td><td>' + this.address + '</td></tr>' +
            '<tr><td>Longitude:</td><td>' + this.longitude + '</td></tr>' +
            '<tr><td>Latitude:</td><td>' + this.latitude + '</td></tr>';
        strHtml += '</table>';
        return strHtml;
    }

    convertGeoLoc(i_str: string): number {  
        const arr = i_str.split("-");
        if (arr.length != 3) {
            console.log("arr's length: " + arr.length);
            return 0;
        }      
        let loc = parseFloat(arr[0]) + parseFloat(arr[1])/60 + parseFloat(arr[2])/3600;
        console.log("loc: " + loc);
        return loc;
    }
    
    formatGeoLoc(i_str: string): string{
        console.log("format geoloc: " + i_str);
        const arr = i_str.split("-");
        if (arr.length != 3) {
            console.log("arr's length: " + arr.length);
            return i_str;
        } 
        let deg2 = arr[0].toString() + decodeURI('%C2%B0') + " ";
        let min2 = arr[1].toString() + "'  ";
        let sec2 = arr[2].toString() + "\"";
        return deg2 + min2 + sec2;
    }
}

export { BbqRecordMaster, BbqRecordDetail, BbqRecord, clsBbq };