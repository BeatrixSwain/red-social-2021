import { Component } from '@angular/core';
import { UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent {
  public title:string;
  public identity:any;

  constructor(private _userService:UserService
  ){
    this.title = 'Wittian';
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    console.log("... app.component.ts... identity");
    console.log(this.identity);

  }
}