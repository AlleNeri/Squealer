import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-user-info-card',
  templateUrl: './user-info-card.component.html',
  styleUrls: ['./user-info-card.component.css']
})
export class UserInfoCardComponent {
  @Input({ required: true }) userInfo!: string;
  @Input({ required: true }) title!: string;
}
