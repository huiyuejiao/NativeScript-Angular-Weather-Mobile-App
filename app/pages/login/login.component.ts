import { Component, ElementRef, OnInit, ViewChild  } from "@angular/core";
import { User } from "../../shared/user/user";
import { UserService } from "../../shared/user/user.service";
import { Router } from "@angular/router";
import { Page } from "ui/page";
import { Color } from "color";
import { View } from "ui/core/view";
import { TextField } from "ui/text-field";
import * as tnsOAuthModule from 'nativescript-oauth';
import * as dialogs from 'ui/dialogs';
@Component({
  selector: "my-app",
  templateUrl: "pages/login/login.component.html",
  styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})
export class LoginComponent implements OnInit{
@ViewChild("container") container: ElementRef;
@ViewChild("email") email: ElementRef;
@ViewChild("password") password: ElementRef;
  isLoggingIn = true;
  user: User;
constructor(private router: Router, private userService: UserService, private page: Page) {
  this.user = new User();
}
ngOnInit(){
  this.page.actionBarHidden = true;
  this.page.backgroundImage = "res://bg_login";
}
setTextFieldColors() {
  let emailTextField = <TextField>this.email.nativeElement;
  let passwordTextField = <TextField>this.password.nativeElement;

  let mainTextColor = new Color(this.isLoggingIn ? "black" : "#C4AFB4");
  emailTextField.color = mainTextColor;
  passwordTextField.color = mainTextColor;
}
submit() {
  if (this.isLoggingIn) {
    this.login();
  } else {
    this.signUp();
  }
}
 public onTapLogin() {
        tnsOAuthModule.ensureValidToken()
            .then((token: string) => {
                    console.log(token)
                    console.log('Dialog closed!');
                    this.router.navigate(["/weather"])
                

            })
            .catch((er) => {
                console.error('error logging in');
                console.dir(er);
            });
    }



login() {
  this.userService.login(this.user)
    .subscribe(
      () => this.router.navigate(["/weather"]),
      (error) => alert("Unfortunately we could not find your account.")
    );
}
signUp() {
  this.userService.register(this.user)
  .subscribe(()=>{
    alert("Your account was successfully cretoggleDisplayated.");
    this.toggleDisplay()
  },
  ()=>{
    alert("Unfortunately we were unable to create your account.")
  });
}
  toggleDisplay() {
   this.isLoggingIn = !this.isLoggingIn;
   this.setTextFieldColors();
let container = <View>this.container.nativeElement;
container.animate({
backgroundColor: this.isLoggingIn ? new Color("white") : new Color("#301217"),
duration: 200
 });
  }

}