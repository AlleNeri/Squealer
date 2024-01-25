import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { LatLng } from 'leaflet';

import { Channel } from 'src/app/interfaces/channel';

import Client from 'src/app/classes/client';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { BackendComunicationService } from 'src/app/services/backend-comunication.service';

@Component({
  selector: 'app-post-as-client',
  templateUrl: './post-as-client.component.html',
  styleUrls: ['./post-as-client.component.css']
})
export class PostAsClientComponent implements OnInit {
  @Input({required: true}) client!: Client;
  protected isDrawerVisible: boolean;
  protected postForm: FormGroup;
  protected channels: Channel[];

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private backend: BackendComunicationService,
    private msgService: NzMessageService
  ) {
    this.isDrawerVisible = false;
    this.channels = [];
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      text: [''],
      img: [null],
      position: [null],
      channel: ['', [Validators.required]],
    }, { validators: this.contentValidator() });
  }

  ngOnInit(): void {
    if(!this.auth.isLoggedIn()) {
      this.msgService.error("Autenticazione non riuscita");
      return;
    }
    this.backend.get(`channels/all`, this.auth.token!)
      .subscribe(res => this.channels = res as Channel[]);
  }

  private contentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const text = control.get('text');
      const img = control.get('img');
      const position = control.get('position');
      return (text?.value || img?.value || position?.value) ? null : { noContent: true };
    }
  }

  protected getImg(data: NzUploadFile): void {
    this.postForm.setValue({
      ...this.postForm.getRawValue(),
      img: data
    });
  }

  protected getPos(data?: LatLng): void {
    if(data)
      this.postForm.setValue({
        ...this.postForm.getRawValue(),
        position: {
          latitude: data.lat,
          longitude: data.lng
        }
      });
    else
      this.postForm.setValue({
        ...this.postForm.getRawValue(),
        position: null
      });
  }

  protected post() {
    if(!this.auth.isLoggedIn()) {
      this.msgService.error("Non sei loggato");
      return;
    }
    const body = {
      post: {
        title: this.postForm.value.title,
        content: {
          text: this.postForm.value.text,
          img: this.postForm.value.img == '' ? null : this.postForm.value.img,
          position: this.postForm.value.position
        },
        posted_on: this.postForm.value.channel,
      }
    };
    console.log("body:", body);
    this.backend.post(`posts?as=${this.client.id}`, body, this.auth.token!)
      .subscribe(_ => {
          this.postForm.reset();
          this.toggleDrawer();
        }
      );
  }

  protected toggleDrawer(): void { this.isDrawerVisible = !this.isDrawerVisible; }
}
