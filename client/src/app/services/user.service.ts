//24.02.2021
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { GLOBAL } from  './global';

//De forma predeterminada, este decorador está configurado con una propiedad providedIn, 
//que crea un provider de servicio. En este caso, providedIn:‘root’ especifica que el 
//servicio debe proporcionarse en el inyector raíz (AppModule).
@Injectable() 
export class UserService{
    public url: string;
    constructor(public _http:HttpClient){
            this.url = GLOBAL.url;
    }

    register(user:User): Observable<any>{
     //   console.log(user)
     //   console.log(this.url);
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url+'register',params, {headers:headers} );
    }

    login(user:any, gettoken:any=null): Observable<any>{
       // console.log(user)
       // console.log(this.url);
        if(gettoken!=null){
            user.gettoken = gettoken;
        }

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url+'login',params, {headers:headers} );
    }
}
