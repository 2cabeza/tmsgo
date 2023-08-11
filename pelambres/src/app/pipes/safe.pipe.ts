import { ElementRef, Pipe, PipeTransform, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Utils } from '../utils/utils';
import * as moment from 'moment';
import * as _ from 'lodash';
import { IonCol } from '@ionic/angular';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer, public util: Utils, private renderer2: Renderer2) {
    moment.locale('es');
  }

  public transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'no-html': return this.strip_html_tags(value);
      case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script': return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'new': return this.new_session(value);
      case 'color': return this.getColor(value);
      case 'empty': return this.isEmpty(value);
      case 'is_assets': return this.is_assets(value);
      case 'storage': return this.getImageStorage(value);
      case 'value': return this.getValue(value);
      case 'humans': return this.getDateFormat(value, 'humans');
      case 'addAttr': return this.addAttr(value);
      case 'datetime': return this.getDateFormat(value, 'DD/MM/YYYY hh:mm');
      case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default: throw new Error(`Invalid safe type specified: ${type}`);
    }
  }

  getValue(item: any) {
    let result = 'Item'
    try {
      // console.log('item', item.value, item);
      let values_ = String(item.value).split(',')
      if (values_.length > 0) {
        result = ''
        for (let value_ of values_) {
          // console.log('pipe value', value_, item.item)
          result += _.get(item.item, String(value_).trim()) + " "
        }
      }
    } catch (ex) { }
    return result;
  }

  addAttr(item: any) {
    console.log('item pipe', item);
    let col = item[0] as IonCol;
    try {
      
      let attrs = JSON.parse((String(item[1]).split("'").join('"')))
      console.log('eval', attrs)
      _.forEach(attrs, function (value, key) {
        let key2 = String(key).split('-');
        let key_ = key2[0] + String(key2[1])[0].toUpperCase() + String(key2[1]).substr(1).toLowerCase();
        console.log('value=', value, '&key=' + key_);
        col[key_] = value;
      });
    }catch(ex){
      col.size = "6";
    }


    // // this.renderer2.setAttribute(element, 'size', '3');
    // console.log('item pipe', col);
    return true;
  }

  is_assets(str: string) {
    return _.startsWith(str, 'assets');
  }


  strip_html_tags(str: string) {
    if ((str === null) || (str === ''))
      return false;
    else
      str = str.toString();
    return str.replace(/<[^>]*>/g, '');
  }

  getColor(color = '#CCCCCC') {
    if (color) {
      let style = {
        'background-color': color,
      };
      return style;
    } else {
      return {}
    }
  }



  new_session(str: string) {
    // console.log('pipe', str);
    if (str.search('new') == -1) {
      return str;
    }
    return str + '/' + this.util.getNumber();
  }

  getImageStorage(filename: any) {
    // console.log('pipe', filename);
    return environment.filePath + filename;
  }

  getDateFormat(value: any, format: any) {
    let date: any = moment('')
    if (format == 'humans') {
      date = this.util.getHumansDate(value);
    } else {
      date = moment(value).format(format);
    }

    return date;
  }

  isEmpty(value: string) {
    try {
      if (value == null || value == undefined || value == '') {
        value = ' - '
      } else {
        value = value;
      }
    } catch (error) {
      value = ' - '
    }
    return value;
  }
}