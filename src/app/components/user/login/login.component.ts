import { Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../../services/user.service.client';
import {NgForm} from '@angular/forms';
import {User} from '../../../models/user/user.model.client';
import {SharedService} from '../../../services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('f') loginForm: NgForm;

  //properties
  username: String;
  password: String;
  errorFlag: boolean;
  errorMsg = 'Invalid username or password !';


  constructor(private userService: UserService,
              private sharedService: SharedService,
              private router: Router) { }

  login() {
    /*
    this.userService.findUserByCredentials
    (this.loginForm.value.username, this.loginForm.value.password).
      subscribe((user: User) => {
      if (user) {
        this.router.navigate(['/user', user._id]);
      } else {
        this.errorFlag = true;
      }
    });
    */
    // fetching data from loginForm
    this.username = this.loginForm.value.username;
    this.password = this.loginForm.value.password;

    // calling client side userservice to send login information
    console.log('data', this.username);
    this.userService.login(this.username, this.password)
      .subscribe(
        (data: any) => {
          console.log(data);
          this.sharedService.user = data;
          this.router.navigate(['/user', data._id])},
        (error: any) => {
          console.log(error);
        }
      );
  }

  fblogin() {
    this.userService.fbLogin()
      .subscribe(
        (data: any) => {
          console.log(data);
          this.sharedService.user = data;
          this.router.navigate(['/user', data._id])},
        (error: any) => {
          console.log(error);
        }
      );
  }

  ngOnInit() {
  }

}
