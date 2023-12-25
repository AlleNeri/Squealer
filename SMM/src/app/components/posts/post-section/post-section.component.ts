import { Component, Input } from '@angular/core';

import Client from 'src/app/classes/client';

@Component({
  selector: 'app-post-section',
  templateUrl: './post-section.component.html',
  styleUrls: ['./post-section.component.css']
})
export class PostSectionComponent {
  @Input({required: true}) client!: Client;
}
