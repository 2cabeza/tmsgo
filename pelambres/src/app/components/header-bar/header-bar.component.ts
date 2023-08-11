import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
})
export class HeaderBarComponent implements OnInit {

  @Input() titulo: any;
  @Input() back: boolean;
  @Input() href: string;
  @Input() text: string;



  constructor() { 


    this.back = false;
    this.href = '/component';
    this.text = '';
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    console.log('CHANGES', changes);

  }

}
