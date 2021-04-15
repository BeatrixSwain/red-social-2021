import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Publication } from '../models/publication';
import { GLOBAL } from  './global';

//De forma predeterminada, este decorador está configurado con una propiedad providedIn, 
//que crea un provider de servicio. En este caso, providedIn:‘root’ especifica que el 
//servicio debe proporcionarse en el inyector raíz (AppModule).
@Injectable() 
export class PublicationService{
    public url:string;

    constructor(private _http:HttpClient){
        this.url = GLOBAL.url;
    }

    addPublication(token:any, publication:Publication):Observable<any>{
        let params = JSON.stringify(publication);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
        return this._http.post(this.url+'publication', params, {headers:headers});
    }

    getPublications(token:any, page=1):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
        return this._http.get(this.url+'publications/'+page, {headers:headers});
    }

    deletePublication(token:any, idPublication:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
        return this._http.delete(this.url+'publication/'+idPublication, {headers:headers});
    }
    
}//