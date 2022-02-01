import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  email = '';
  password = '';
  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  signUpHandler(form: NgForm) {
    this.loadingController
      .create({ message: 'Sign in..' })
      .then((loadingElement) => {
        loadingElement.present();
        const { email, password } = form.value;
        this.authService.signUp(email, password).subscribe(
          (res) => {
            loadingElement.dismiss();
            form.reset();
            this.router.navigateByUrl('/auth/login');
          },
          (error) => {
            loadingElement.dismiss();
            const resMsg = error?.error.error?.message;
            this.executeAlert(resMsg);
          }
        );
      });
  }

  private executeAlert(message: string) {
    this.alertController
      .create({ header: 'Register failed.', message, buttons: ['OK'] })
      .then((alertElement) => alertElement.present());
  }
}
