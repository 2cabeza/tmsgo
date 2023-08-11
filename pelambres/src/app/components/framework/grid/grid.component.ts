import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'go-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {

  // table
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  @Input() data!: any[];
  dataSource!: MatTableDataSource<any>;
  @Input() columns!: any[];
  @Input() columnsName!: any[];
  @Input() title!: any;

  selectedRowIndex = -1;
  // own
  item: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    
    try{
      if(changes['data']){
        console.log('viene data')
        this.setData();
      }
    }catch(e){
    }
  }

  setData(){
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  highlight(row: any){
    this.item = row;
    // console.log('row', row)
    // this.resetForm();
    // this.selectedRowIndex = row.id;
    // this.recipe = row.item;
    // this.router.navigate(['quotation'], { queryParams: { recipe: row.id} });
  }

}
