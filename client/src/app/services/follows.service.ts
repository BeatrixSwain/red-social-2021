//14.04.2021

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Follow } from '../models/follow';
import { GLOBAL } from  './global';

//De forma predeterminada, este decorador está configurado con una propiedad providedIn, 
//que crea un provider de servicio. En este caso, providedIn:‘root’ especifica que el 
//servicio debe proporcionarse en el inyector raíz (AppModule).
@Injectable() 
export class FollowService{
    public url:string;

    constructor(private _http:HttpClient){
        this.url = GLOBAL.url;
    }

    addFollow(token:any, follow:any):Observable<any>{
        let params = JSON.stringify(follow)
        let headers = new HttpHeaders().set('Content-type', 'application/json')
                                        .set('Authorization', token);
        

        return this._http.post(this.url+'follow', params, {headers:headers});

    }

    deleteFollow(token:any, id:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-type', 'application/json')
                                        .set('Authorization', token);
        
        return this._http.delete(this.url+'follow/'+id, {headers:headers});

    }
}//FollowService