import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule,AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import {lockClosedOutline,lockOpenOutline,mailOutline,personOutline,arrowBackOutline} from 'ionicons/icons';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule,RouterLink]
})
export class SignupPage implements OnInit {

  signupForm!: FormGroup;
  isTypePassword: boolean = true;
  isLoading=true;

  constructor(private authService:AuthService,private router:Router,private alertController: AlertController) 
  { addIcons({lockClosedOutline,lockOpenOutline,mailOutline,personOutline,arrowBackOutline})
    this.initForm();
  }

  ngOnInit() {
  }

  initForm() {
    this.signupForm = new FormGroup({
      username: new FormControl('', 
        {validators: [Validators.required]}
      ),
      email: new FormControl('', 
        {validators: [Validators.required, Validators.email]}
      ),
      password: new FormControl('', 
        {validators: [Validators.required, Validators.minLength(8)]}
      ),
    });
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  onSubmit() {
    if(!this.signupForm.valid) return;
    console.log(this.signupForm.value);
    this.register(this.signupForm)

  }
  register(form:any){
    this.isLoading=true
    console.log(form.value);
    this.authService.register(form.value).then((data:any)=>{
      console.log(data)
      this.router.navigateByUrl('/home');
      this.isLoading=false
      form.reset();
    })
    .catch(e=>{
      console.log(e);
      let msg:string='Could not sign you up , please try again.';
    if(e.code== 'auth/email-already-in-use'){
      msg = 'email alredy in use';
    }
    this.showAlert(msg)
    })
  }
  async showAlert(msg:any){
    const alert = await this.alertController.create({
      header:'Alert',
      subHeader:'Important message',
      message:msg,
      buttons:['OK'],
    });
    await alert.present();
  }

}
