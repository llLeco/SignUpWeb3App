import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { HederaService } from '../services/hedera.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  public loginForm: FormGroup;
  public showPassword: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private http: HttpClient, private toastController: ToastController, private hederaService: HederaService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post<{user: any, wallet: any}>('http://localhost:3000/users/login', this.loginForm.value)
        .subscribe({
          next: response => {
            this.router.navigate(['/home']);
            this.presentToast('Logged in successfully', 'success');
            this.hederaService.initClient(this.loginForm.value.password);
          },
          error: err => {
            console.error(err);
            this.presentToast('Login failed', 'danger');
          }
        });
    }
  }


}
