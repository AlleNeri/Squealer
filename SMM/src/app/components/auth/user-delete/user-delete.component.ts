import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { BackendComunicationService } from 'src/app/services/backend-comunication.service';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css']
})
export class UserDeleteComponent {
  protected isVisible: boolean;

  constructor(
    private auth: AuthenticationService,
    private backendComunication: BackendComunicationService,
    private msgService: NzMessageService,
    private router: Router
  ) {
    this.isVisible = false;
  }

  protected toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  protected handleOk() {
    this.backendComunication.delete(`users/${this.auth.userId!}/delete`, this.auth.token!)
      .subscribe((d: any) => {
        if(d.success) {
          this.auth.logout();
          this.msgService.success('Utente eliminato con successo');
          this.router.navigate(['/home']);
        }
        else this.msgService.error("Errore durante l'eliminazione");
      });
    this.toggleVisibility();
  }
}
