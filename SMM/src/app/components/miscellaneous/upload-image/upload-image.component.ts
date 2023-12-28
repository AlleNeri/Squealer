import { Component } from '@angular/core';
import { NzMessageRef, NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent {
  fileList: NzUploadFile[];
  private uploadedImg: string | undefined;

  constructor(private msgService: NzMessageService) {
    this.fileList = [];
    this.uploadedImg = undefined;
  }

  protected beforeUpload = (file: NzUploadFile): boolean => {
    const f: File= file as unknown as File;
    const actualMessageRef: NzMessageRef= this.msgService.loading(`Caricamento del file ${f.name}...`);

    if(!file.type?.startsWith('image')) {
      this.msgService.remove(actualMessageRef.messageId);
      this.msgService.error('È permesso solo il caricamento delle immagini!');
      return false;
    }

    const render = new FileReader();
    render.onload = () => {
      this.uploadedImg = render.result as string;

      const prevFile = this.fileList.pop() as unknown as File
      this.fileList = this.fileList.concat(file);

      this.msgService.remove(actualMessageRef.messageId);
      if(prevFile)
        this.msgService.warning(`Il file ${prevFile.name} è stato sovrascritto`);
      this.msgService.success(`Il file ${f.name} è stato caricato correttamente`);
    }

    try { render.readAsDataURL(f); }
    catch (e) {
      this.msgService.remove(actualMessageRef.messageId);
      this.msgService.error(`Il file ${f.name} non è stato processato correttamente`)
    }
    finally { return false; }
  }
}
