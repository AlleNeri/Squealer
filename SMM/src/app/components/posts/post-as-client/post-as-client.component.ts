import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';

import Client from 'src/app/classes/client';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { BackendComunicationService } from 'src/app/services/backend-comunication.service';
import {Observable, Observer} from 'rxjs';

@Component({
  selector: 'app-post-as-client',
  templateUrl: './post-as-client.component.html',
  styleUrls: ['./post-as-client.component.css']
})
export class PostAsClientComponent {
  @Input({required: true}) client!: Client;
  protected isDrawerVisible: boolean;
  protected postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private backend: BackendComunicationService,
    private msgService: NzMessageService
  ) {
    this.isDrawerVisible = false;
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      text: ['', [Validators.required]],
      channel: ['', [Validators.required]],
    });
  }

  protected post() {
    if(!this.auth.isLoggedIn()) return;
    const body = {
      post: {
        title: this.postForm.value.title,
        content: {
          text: this.postForm.value.text,
        },
        posted_on: this.postForm.value.channel,
      }
    };
    console.log(body);
    this.backend.post(`posts?as=${this.client.id}`, body, this.auth.token!)
      .subscribe(
        res => {
          console.log(res);
          this.postForm.reset();
          this.toggleDrawer();
        }
      );
  }

  protected toggleDrawer(): void { this.isDrawerVisible = !this.isDrawerVisible; }
}
