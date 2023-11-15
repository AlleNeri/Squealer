import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl, FormBuilder } from '@angular/forms';

import { IRegisterBody } from 'src/app/interfaces/auth-user';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register-card',
  templateUrl: './register-card.component.html',
  styleUrls: ['./register-card.component.css']
})
export class RegisterCardComponent {
  public registerForm: FormGroup;
  public nameMinLength: number = 4;
  public passwordMinLength: number = 8;

  constructor(private auth: AuthenticationService, private router: Router, private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      username: [ null, [
        Validators.required,
        Validators.minLength(this.nameMinLength),
        Validators.pattern(/^[a-zA-Z0-9].+$/),
      ]],
      password: [ null, [
        Validators.required,
        Validators.minLength(this.passwordMinLength),
        //pattern validator for password with at least 1 uppercase, 1 lowercase and 1 number  TODO: make other characters are allowed
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
      ]],
      confirmPassword: [ null, Validators.required],
      name: [ null, [
        Validators.required,
        Validators.minLength(this.nameMinLength),
        Validators.pattern(/^[a-zA-Z]+$/),
      ]],
      surname: [ null, [
        Validators.required,
        Validators.minLength(this.nameMinLength),
        Validators.pattern(/^[a-zA-Z]+$/),
      ]],
      birthDate: [ null, [
        Validators.required,
        this.beforeTodayValidator,
      ]],
      email: [ null, [
        Validators.required,
        Validators.email,
      ]],
    }, { validators: this.confirmPasswordValidator() });
  }

  //custom validator for confirm password
  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordControl = control.get('password');
      const confirmPasswordControl = control.get('confirmPassword');
      if (passwordControl && confirmPasswordControl) {
        if (passwordControl.value !== confirmPasswordControl.value) {
          confirmPasswordControl.setErrors({ notEquivalent: true });
          return { notEquivalent: true } as ValidationErrors;
        }
        else {
          confirmPasswordControl.setErrors(null);
          return null;
        }
      }
      else return null;
    };
  }

  //custom validator for birth date
  beforeTodayValidator(control: AbstractControl): ValidationErrors | null {
    const birthDate = new Date(control.value);
    const today = new Date();
    if(isNaN(birthDate.getTime()) || birthDate >= today) return { beforeToday: true } as ValidationErrors;
    else return null;
  }

  onSubmit() {
    //get the data to sent to the server
    const body: any = this.registerForm.value;
    const registerUser: IRegisterBody= {
      user: {
        u_name: body.username,
        name: {
          first: body.name,
          last: body.surname,
        },
        email: body.email,
        type: "smm",
      },
      password: body.password
    };
    console.log(registerUser);
    this.auth.register(registerUser)
      .add(() => {
        //redirect to the dashboard if the registration is successful(because the user is logged in)
        if(this.auth.isLoggedIn()) this.router.navigate(['/smm']);
        //TODO: the username is unique, so if the registration fails because of the username, the user should be notified
        //TODO: the email is unique, so if the registration fails because of the email, the user should be notified
        //suggestion: the problem is in the backend because the server should return a 409 error and not a 500 error
        else alert("Registrazione fallita, se possiedi già un account effettua il login!");
      });
  }
}