import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  loginHandler(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.loadingController
      .create({ message: 'Login..' })
      .then((loadingElement) => {
        loadingElement.present();
        const email = form.value.email;
        const password = form.value.password;
        this.authService.login(email, password).subscribe(
          (res) => {
            console.log(res);
            form.reset();
            loadingElement.dismiss();
            this.router.navigateByUrl('/recipes');
          },
          (error) => {
            loadingElement.dismiss();
            const resMsg = error?.error.error?.message|| 'Login failed';
            this.executeAlert(resMsg);
          }
        );
      });
  }

  private executeAlert(message: string) {
    this.alertController
      .create({ header: 'Login failed.', message, buttons: ['OK'] })
      .then((alertElement) => alertElement.present());
  }
}
