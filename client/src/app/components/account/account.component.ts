import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params, RouterLinkWithHref} from '@angular/router';
import { error } from 'protractor';
import { VirtualTimeScheduler } from 'rxjs';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload-service';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'AccountComponent',
    templateUrl: './account.component.html',
    providers:[UserService, UploadService]
})

export class AccountComponent implements OnInit{
    public title:string;
    public user:any;
    public identity:any;
    public token:any;
    public status:string;
    public filesToUpload: Array<File>;
    public url:String;


    constructor(
        private _rounte:ActivatedRoute,
        private _rounter:Router,
        private _userService:UserService,
        private _uploadService:UploadService

    ){
        this.title = 'Actualizar mis datos';
        this.user = this._userService.getIdentity();
        this.identity = this.user;
        this.token = this._userService.getToken();
        this.status = "";
        this.filesToUpload = Array<File>();
        this.url = GLOBAL.url;

    }

    ngOnInit(){
        console.log("AccountComponent.component cargado");
        console.log(this.user);
    }
    
    onSubmit(){
        console.log("Onsubmit");
        console.log(this.user);
        this._userService.updateUser(this.user).subscribe(
            response=>{
                console.log(response);
                if(!response.user){
                    this.status= 'Error';
                }else{
                    this.status ="Success";
                    console.log(this.user)
                    localStorage.setItem("identity", JSON.stringify(this.user));

                    //SUBIDA DE IMAGEN
                    this._uploadService.makeFileRequest(this.url+"upload-image-user/"+this.user._id, [], this.filesToUpload, this.token, 'image').then(
                        (result:any)=>{
                            console.log(result);
                            this.user.image = result.user.image;
                            localStorage.setItem('identity', JSON.stringify(this.user));
                        }
                    );
                }
            },
            error=>{
                var errorMessage = <any>error;
                console.log(errorMessage);
                if(errorMessage!=null){
                    this.status = 'error'
                }
            }
        );
    }

    fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);

    }
}