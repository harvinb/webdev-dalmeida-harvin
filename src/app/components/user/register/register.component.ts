import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../services/user.service.client';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {User} from '../../../models/user/user.model.client';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('f') regForm: NgForm;

  username: string;
  password: string;
  errorFlag: boolean;
  errorMsg: string;

  constructor(private userService: UserService,
              private router: Router) { }

  register() {
    this.username = this.regForm.value.username;
    this.password = this.regForm.value.password;

    console.log(this.username);
    console.log(this.password);
    console.log(this.regForm.value.verifypwd);

    this.userService.findUserByUsername(this.username).
    subscribe((user: User) => {
      if (user) {
        // console.log(user);
        this.errorMsg = 'Username is already taken';
        this.errorFlag = true;
      } else if (this.password !== this.regForm.value.verifypwd) {
        this.errorMsg = 'Passwords do not match';
        this.errorFlag = true;
      } else {
        /*
        this.userService.createUser
        (this.username, this.password)
          .subscribe((newuser: User) => {
            if (newuser) {
              console.log(newuser);
              this.router.navigate(['/user', newuser._id]);
            }
          });
          */

        this.userService.register(this.username, this.password)
          .subscribe(
            (data: any) => {
              this.router.navigate(['/user', data._id]);
            },
            (error: any) => {
              this.errorMsg = error._body;
              this.errorFlag = true;
            }
          );
      }
    });
  }

  ngOnInit() { }

}
