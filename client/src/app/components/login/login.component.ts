import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { UserService} from '../../services/user.service'

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.css'],
    providers: [UserService]
})

export class LoginComponent implements OnInit{
    public title:string;
    public user:User;
    public status:string;
    public identity:any;
    public token:string;

    constructor(private _route:ActivatedRoute, private _router:Router, private _userService:UserService

    ){
        this.title = "Identifícate";
        this.user = new User( "","","","","","","");
        this.status = "";
    //    this.identity /*= new User( "","","","","","","","")*/;
      this.token = "";
    }

    ngOnInit(){
        console.log('Componente de login cargado...');
    }

    onSubmit(form:any){
        //Loguear al usuario y conseguir sus datos
        this._userService.login(this.user).subscribe( 
            response =>{      
                console.log("Response")
                console.log(response);
                console.log("Identity");
              //  console.log(response);
                this.identity = response.user;
                console.log(  this.identity);

                if(!this.identity||!this.identity._id){
                    this.status = 'error';
                }else{
                    this.status  = 'success';
                    //Persistir datos del usuario
                    //en el local storage -> pequeña memoria del navegador web. almacenamiento local, cada url tiene la propia.
                    localStorage.setItem('identity', JSON.stringify(this.identity));
                    this._userService.getIdentity();
                    //Conseguir token
                    this.getToken();
                }
                //form.reset();               
            }, error=>{
                console.log(<any>error);
                var errorMessage =<any>error.error.message;
                console.log(errorMessage);
                if(errorMessage!=null){
                    if(errorMessage!=null){
                        this.status = 'Hubo un error: '+errorMessage;
                    }else{
                        this.status = 'Hubo un error: ';
                    }
                }
            }
        );

    }

    public getToken(){
        //Get token
        this._userService.login(this.user, "true").subscribe( 
            response =>{             
                this.token = response.token;
                if(this.token.length<=0){
                    this.status = 'error';
                }else{
                    this.status  = 'success';
                    console.log(this.token);
                    //Persistir token del usuario
                    localStorage.setItem('token', this.token);

                    //Conseguir estadisticas
                }
            }, error=>{
                var errorMessage =<any>error;
                console.log(<any>error);
                if(errorMessage!=null){
                    this.status = 'Hubo un error';
                }
            }
        );

    }
}