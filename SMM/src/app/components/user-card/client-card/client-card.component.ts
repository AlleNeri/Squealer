import { Component, Input } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { BuyCharFormComponent } from '../../miscellaneous/buy-char-form/buy-char-form.component';

import Client from 'src/app/classes/client';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.css']
})
export class ClientCardComponent {
  @Input({required: true}) client!: Client;

  constructor(
    private modal: NzModalService,
  ) {}

  protected buyCharModal() {
    const modal: NzModalRef= this.modal.info({
      nzCentered: true,
      nzTitle: "Compra caratteri per il tuo cliente",
      nzContent: BuyCharFormComponent,
      nzData: { userId: this.client.id },
      nzOkText: "Compra",
      nzOnOk: ()=> modal.getContentComponent().onSubmit()
    });
  }
}
