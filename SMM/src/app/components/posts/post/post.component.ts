import { Component, Input } from '@angular/core';

import { BackendComunicationService } from 'src/app/services/backend-comunication.service';

import Client from 'src/app/classes/client';

import { IPost } from 'src/app/interfaces/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  @Input({ required: true }) post!: IPost;
  @Input({ required: true }) user!: Client;

  constructor(
    protected backendComunication: BackendComunicationService
  ) { }

  protected postDate(): string {
    const date = new Date(this.post.date);
    //return the date and time in the format: YYYY-MM-DD HH:MM
    //if the day is today, return only the time
    const today = new Date();
    if (date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()) {
      return `today-${date.getHours()}:${date.getMinutes()}`;
    }
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  }

  protected viewsCount(): number {
    return this.post.reactions.length;
  }

  protected likesCount(): number {
    return this.post.reactions
      .filter(reaction => reaction.value === 1)
      .length;
  }

  protected dislikesCount(): number {
    return this.post.reactions
      .filter(reaction => reaction.value === -1)
      .length;
  }

  protected disappointCount(): number {
    return this.post.reactions
      .filter(reaction => reaction.value === -2)
      .length;
  }

  protected heartCount(): number {
    return this.post.reactions
      .filter(reaction => reaction.value === 2)
      .length;
  }
}
