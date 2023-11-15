import { Component, Input, booleanAttribute } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) text!: string;
  @Input() img?: string;
  @Input({ transform: booleanAttribute }) rightImg: boolean = true;
}
