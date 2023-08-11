import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import  * as _ from 'lodash';

@Component({
  selector: 'go-render-html',
  templateUrl: './render-html.component.html',
  styleUrls: ['./render-html.component.scss'],
})
export class RenderHtmlComponent implements OnInit {
  @Input() html: string;
  @Input() data: {};
  renderedHtml: string;

  constructor() { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    // console.log('changes', changes)
    if(changes['html']){
      this.renderHtml();
    }
  }

  renderHtml(){
    console.log('renderHtml');
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    this.html = _.unescape(this.html);
    var compiled = _.template(this.html);
    this.renderedHtml = compiled(this.data);
  }

}
