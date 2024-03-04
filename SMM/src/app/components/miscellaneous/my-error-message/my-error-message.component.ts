import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-my-error-message',
  templateUrl: './my-error-message.component.html',
  styleUrls: ['./my-error-message.component.css']
})
export class MyErrorMessageComponent {
  @Input() message!: string;
}
