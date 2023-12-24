import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { BuyCharFormComponent } from '../../miscellaneous/buy-char-form/buy-char-form.component';

import Client from 'src/app/classes/client';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.css']
})
export class ClientCardComponent implements OnInit {
  @Input({required: true}) client!: Client;
  protected charTooltip: string = "";
  protected quoteTooltip: string = "";

  constructor(
    private modal: NzModalService,
  ) {}

  ngOnInit(): void {
    this.charTooltip = `Giornalieri: ${this.client.charNumber?.dayly}\nSettimanali: ${this.client.charNumber?.weekly}\nMensili: ${this.client.charNumber?.monthly}`
    this.quoteTooltip = `Giornalieri: ${this.client.quoteNumber?.dayly}\nSettimanali: ${this.client.quoteNumber?.weekly}\nMensili: ${this.client.quoteNumber?.monthly}`
  }

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
