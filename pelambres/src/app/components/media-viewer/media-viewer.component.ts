import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['./media-viewer.component.scss'],
})
export class MediaViewerComponent implements OnInit {
  @Input() media: any;
  @Input() type: any;
  @Input() icon: any;
  @Input() modal: any;

  typeClass: any;

  constructor() { }

  ngOnInit() {

    // const got = require('got');
    // const FileType = require('file-type');
    
    // const url = this.media;
    
    // (async () => {
    //     const stream = got.stream(url);
    
    //     console.log(await FileType.fromStream(stream));
    //     //=> {ext: 'jpg', mime: 'image/jpeg'}
    // })();
  }

  dismiss(status: boolean = false) {
    this.modal.dismiss({
      'dismissed': true,
      'changes': status,
    });
  }

}
