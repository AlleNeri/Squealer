import { Component, Input, OnInit } from '@angular/core';

import { BackendComunicationService } from 'src/app/services/backend-comunication.service';

import Client from 'src/app/classes/client';

import { IPost } from 'src/app/interfaces/post';
import { IChannel } from 'src/app/interfaces/channel';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input({ required: true }) post!: IPost;
  @Input({ required: true }) user!: Client;
  protected channelName!: string;

  constructor(
    protected backendComunication: BackendComunicationService
  ) {
    this.channelName;
  }

  ngOnInit(): void { this.loadChannelName(); }

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
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
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

  protected async loadChannelName() {
    this.backendComunication.get(`channels/${this.post.posted_on}`)
      .subscribe((channel: Object) => this.channelName = (channel as IChannel).name);
  }
}
