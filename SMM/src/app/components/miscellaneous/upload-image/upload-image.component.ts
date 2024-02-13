import { Component, EventEmitter, Output } from '@angular/core';
import { NzMessageRef, NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent {
  fileList: NzUploadFile[];
  @Output() uploadedImg: EventEmitter<NzUploadFile | undefined>;

  constructor(private msgService: NzMessageService) {
    this.fileList = [];
    this.uploadedImg = new EventEmitter<NzUploadFile | undefined>();
  }

  protected remove = (_: NzUploadFile): false => {
    this.uploadedImg.emit(undefined);
    this.fileList = [];
    return false;
  }

  protected beforeUpload = (file: NzUploadFile): false => {
    const actualMessageRef: NzMessageRef= this.msgService.loading(`Caricamento del file ${file.name}...`);

    if(!file.type?.startsWith('image')) {
      this.msgService.remove(actualMessageRef.messageId);
      this.msgService.error('È permesso solo il caricamento delle immagini!');
      return false;
    }

    const prevFile = this.fileList.pop() as unknown as File
    this.fileList = this.fileList.concat(file);

    this.msgService.remove(actualMessageRef.messageId);
    if(prevFile)
      this.msgService.warning(`Il file ${prevFile.name} è stato sovrascritto`);
    this.msgService.success(`Il file ${file.name} è stato caricato correttamente`);

    try { this.uploadedImg.emit(file); }
    catch (e) {
      this.msgService.remove(actualMessageRef.messageId);
      this.msgService.error(`Il file ${file.name} non è stato processato correttamente`)
    }
    finally { return false; }
  }
}
