import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { IPost as Post } from 'src/app/interfaces/post';

import { BackendComunicationService } from 'src/app/services/backend-comunication.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

import Client from 'src/app/classes/client';

@Component({
  selector: 'app-post-section',
  templateUrl: './post-section.component.html',
  styleUrls: ['./post-section.component.css']
})
export class PostSectionComponent implements OnInit, OnChanges {
  @Input({required: true}) client!: Client;
  protected posts: Post[];

  constructor(protected backendComunication: BackendComunicationService, protected authService: AuthenticationService) {
    this.posts = [];
  }

  ngOnInit(): void { this.loadPosts(); }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["client"].currentValue.id !== changes["client"].previousValue.id)
      this.loadPosts();
  }

  loadPosts(): void {
    if(this.authService.isLoggedIn())
      this.backendComunication.get(`posts/my?as=${this.client.id}`, this.authService.token!)
        //posts are sorted by date
        .subscribe((posts: Object)=> this.posts = (posts as Post[]).sort((a: Post, b: Post)=> new Date(b.date).getTime() - new Date(a.date).getTime()));
  }

  popularPosts(): Post[] { return this.posts.filter((post: Post)=> post.popular); }
  unpopularPosts(): Post[] { return this.posts.filter((post: Post)=> post.unpopular); }
}
