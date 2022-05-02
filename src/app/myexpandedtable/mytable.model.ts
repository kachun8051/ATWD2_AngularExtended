import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { BbqRecordMaster } from '../BbqRecord.model';
 
interface ColumnItem {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn<BbqRecordMaster> | null;
    listOfFilter: NzTableFilterList;
    filterMultiple: boolean;
    filterFn: NzTableFilterFn<BbqRecordMaster> | null;
  }

interface ColumnFilter {
    text: string;
    value: string;
}

export { ColumnItem, ColumnFilter } 