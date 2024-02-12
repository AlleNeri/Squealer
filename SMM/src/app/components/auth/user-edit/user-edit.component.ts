import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthenticationService } from 'src/app/services/authentication.service';

import { IChangePasswordBody } from 'src/app/interfaces/auth-user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent {
  protected isVisible: boolean;
  protected passwordMinLength: number = 8;
  protected changePasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private msgService: NzMessageService
  ) {
    this.isVisible = false;
    this.changePasswordForm = this.formBuilder.group({
      //read the comments in the onSubmit method to understand why the NAME OF THE FIELD MUST NOT BE CHANGED!
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(this.passwordMinLength),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ])
    });
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  onSubmit(): void {
    //it' very important to do not change the name of the fields in the form builder because of the body needed to be sent to the server in this format
    const body: IChangePasswordBody = this.changePasswordForm.value;
    this.auth.changePassword(body)
      .subscribe((d: any) => {
        if(d.success) this.msgService.success('Password cambiata con successo!');
        else this.msgService.error('Errore durante il cambio della password');
        this.toggleVisibility();
      });
  }
}
