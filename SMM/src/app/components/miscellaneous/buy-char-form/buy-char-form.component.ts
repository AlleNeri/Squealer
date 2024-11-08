import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { BackendComunicationService } from 'src/app/services/backend-comunication.service';

import Client from 'src/app/classes/client';

@Component({
  selector: 'app-buy-char-form',
  templateUrl: './buy-char-form.component.html',
  styleUrls: ['./buy-char-form.component.css']
})
export class BuyCharFormComponent {
  private user: Client;
  protected periods;
  protected form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private backend: BackendComunicationService,
    private auth: AuthenticationService
  ) {
    this.user = inject(NZ_MODAL_DATA).user;
    this.periods = [
      { value: 'day', label: 'al giorno' },
      { value: 'week', label: 'alla settimana' },
      { value: 'month', label: 'al mese' },
    ];
    this.form = this.fb.group({
      quantity: [null, Validators.required],
      period: [this.periods[0].value, Validators.required],
    });
  }

  public onSubmit() {
    if(!this.auth.token) return;
    this.backend.patch(`users/${this.user.id}/char`, this.form.value, this.auth.token!)
      .subscribe((res: any) => {
        if(res.new_char_availability) this.user.charNumber = res.new_char_availability;
      });
  }
}
