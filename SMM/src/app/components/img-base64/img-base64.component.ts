import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-img-base64',
  templateUrl: './img-base64.component.html',
  styleUrls: ['./img-base64.component.css']
})
export class ImgBase64Component implements OnInit {
  @Input({ required: true }) base64!: string;
  public imgSrc: SafeUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.imgSrc = '';
  }

  ngOnInit() {
    this.imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      'data:image/png;base64,' + this.base64
    );
  }
}
