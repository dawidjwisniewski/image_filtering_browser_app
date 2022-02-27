import { Component } from '@angular/core';
// import { UserService } from './services/user.service'; 
import { IfbappService } from './services/ifbapp.service';
import {throwError} from 'rxjs';
import { NavbarModule, WavesModule } from 'angular-bootstrap-md'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ifbapp';

    /**
   * An object representing the user for the login form
   */
  public user:any;

  constructor(
    // public _userService: UserService,
    public ifbappService: IfbappService

    ) {}

  ngOnInit() {
    this.user = {
      username: '',
      password: ''
    };
  }

  login(): void {
    this.ifbappService.login({'username': this.user.username, 'password': this.user.password});
  }

  refreshToken(): void {
    this.ifbappService.refreshToken();
  }

  logout(): void {
    this.ifbappService.logout();
  }
    
}
