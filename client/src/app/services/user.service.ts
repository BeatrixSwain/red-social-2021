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
    public identity:any;
    public token:any;
    public stats:any;
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

    getIdentity(){
        let getItem = localStorage.getItem('identity');
        let identity = null;
        if(getItem!=null){
            if(getItem != 'undefined'){
                identity = JSON.parse(getItem||'undefined');               
                if(identity!='undefined'){
                    this.identity = identity;   
                    return this.identity;              
                }
                
            }
        }
        this.identity = identity;
        return this.identity;
    }

    getToken(){
        let token = localStorage.getItem('token');     
        if(token !='undefined'){
           this.token = token;
        }else{
            this.token = null;
        }
        return this.token;
    }

    getCounters(userId:any=null):Observable<any>{

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());
         if(userId!=null){
            return this._http.get(this.url+'counters/'+userId, {headers:headers});
         }else{
            return this._http.get(this.url+'counters', {headers:headers});

         }
    }

    getStats(){
        let getItem = localStorage.getItem('stats');
        let stats = null;
        if(getItem!=null){
            if(getItem != 'undefined'){
                stats = JSON.parse(getItem||'undefined');               
                if(stats!='undefined'){
                    this.stats = stats;   
                    return this.stats;              
                }
                
            }
        }
        this.stats = stats;
        return this.stats;        
    }
 
    updateUser(user:any):Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());
        return this._http.put(this.url+"update-user/"+user._id, params,  {headers:headers} )                                

    }
}
