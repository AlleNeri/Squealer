import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-card-header',
  templateUrl: './user-card-header.component.html',
  styleUrls: ['./user-card-header.component.css']
})
export class UserCardHeaderComponent {
  @Input({ required: true }) imgSrc?: string;
  @Input({ required: true }) username!: string;
}
