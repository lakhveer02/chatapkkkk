import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule,AlertController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import {lockClosedOutline,lockOpenOutline,mailOutline} from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule,RouterLink]
})
export class LoginPage implements OnInit {

  form!: FormGroup;
  isTypePassword: boolean = true;

  constructor(private authService:AuthService,private router:Router, private alertController :AlertController) 
  {addIcons({mailOutline,lockClosedOutline,lockOpenOutline})
    this.initForm();
  }
  ngOnInit(): void {
    
  }

  initForm() {
    this.form = new FormGroup({
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
    if(!this.form.valid) return;
    console.log(this.form.value);
    this.login(this.form)
  }
login(form:any){
  this.authService.login(form.value.email, form.value.password).then(data=>{
    console.log(data);
    this.router.navigateByUrl('/home');
    form.reset()
  }).catch(e=>{
    console.log(e);
    let msg :string='Could not login please try agin later ';
    if (e.code == 'auth/user-not-found') msg = 'Email address cold not be found';
    else if (e.code == 'auth/wrong-password') msg='Please enter a correct password'
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