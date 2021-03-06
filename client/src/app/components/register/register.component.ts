import { Component, OnInit} from '@angular/core';
import {Router,ActivatedRoute, Params} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.css'],
    providers: [UserService]

})

export class RegisterComponent implements OnInit{
    public title:string;
    public user: User;
    public status:string;


    constructor(private _route:ActivatedRoute, private _router:Router, private _userService:UserService){
        this.title = "Regístrate";
        this.user = new User( "","","","","","","");
        this.status = "";
    }

    ngOnInit(){
        console.log('Componente de register cargado...');
    }

    onSubmit(form:any){
        //Registrar al usuario enviado - 
        this._userService.register(this.user).subscribe( 
            response =>{
                if(response.user && response.user._id){
                    console.log(response.user);
                    this.status  = 'success';
                    form.reset();
                }else{
                    console.log(response);
                    this.status = response.message;
                }
            }, error=>{
                console.log(<any>error);
            }
        );

    }
}