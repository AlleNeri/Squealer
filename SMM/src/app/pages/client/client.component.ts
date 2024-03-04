import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Client from 'src/app/classes/client';

import { UserInformationService } from 'src/app/services/user-information.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {
  public clientInformation?: Client;

  constructor(
    private route: ActivatedRoute,
    private userInformationService: UserInformationService,
    private router: Router
  ) {
    this.route.paramMap.subscribe(params => {
      const id: string | null=params.get('id');
      const tmpInfo: Client | undefined=this.userInformationService.clients.find(client => client.id == id);
      if(tmpInfo === undefined) this.router.navigate(['/smm/general']);
      this.clientInformation=tmpInfo as Client;
    });
  }
}
