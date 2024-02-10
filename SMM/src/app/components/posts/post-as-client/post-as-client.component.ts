import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { LatLng } from 'leaflet';

import { IChannel } from 'src/app/interfaces/channel';
import { IUser } from 'src/app/interfaces/user';
import { IPost } from 'src/app/interfaces/post';

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
  @Output() newPost: EventEmitter<IPost>;
  protected isDrawerVisible: boolean;
  protected postForm: FormGroup;
  protected channels: IChannel[];
  protected mentions: IUser[];

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    protected backend: BackendComunicationService,
    private msgService: NzMessageService
  ) {
    this.isDrawerVisible = false;
    this.channels = [];
    this.mentions = [];
    this.newPost = new EventEmitter<IPost>();
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      text: [''],
      img: [null],
      position: [null],
      channel: ['', [Validators.required]],
      keywords: [[]],
    }, { validators: this.contentValidator() });
  }

  ngOnInit(): void {
    if(!this.auth.isLoggedIn()) {
      this.msgService.error("Autenticazione non riuscita");
      return;
    }
    this.backend.get(`channels/all`, this.auth.token!)
      .subscribe(res => this.channels = res as IChannel[]);
    this.backend.get(`users/mention`, this.auth.token!)
      .subscribe(res => {
        this.mentions = res as IUser[]
        console.log("mentions:", this.mentions);
      });
  }

  protected mentionFunction = (data: IUser) => data.u_name;

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

  getKeywords(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    if(input.endsWith(' ')) {
      const keywords: string[] = this.postForm.get('keywords')?.value;
      if(!keywords.includes(input.trim())) {
        keywords.push(input.trim());
        this.postForm.setValue({
          ...this.postForm.getRawValue(),
          keywords
        });
      }
      (event.target as HTMLInputElement).value = '';
    }
  }

  removeKeyword(keyword: string): void {
    const keywords: string[] = this.postForm.get('keywords')?.value;
    keywords.splice(keywords.indexOf(keyword), 1);
    this.postForm.setValue({
      ...this.postForm.getRawValue(),
      keywords
    });
  }

  get keywords(): string[] {
    return this.postForm.get('keywords')?.value;
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
        keywords: this.postForm.value.keywords,
      }
    };
    console.log("body:", body);
    this.backend.post(`posts?as=${this.client.id}`, body, this.auth.token!)
      .subscribe((res: any) => {
          console.log(res);
          if(res.user_char_availability) this.client.charNumber = res.user_char_availability;
          if(res.post) this.newPost.emit(res.post);
          this.postForm.reset();
          this.toggleDrawer();
        }
      );
  }

  protected toggleDrawer(): void { this.isDrawerVisible = !this.isDrawerVisible; }
}
