import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'ProfileComponent',
    templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit{
    public title:string;
    constructor(
        private _rounte:ActivatedRoute,
        private _rounter:Router,
        private _userService:UserService
    ){
        this.title = 'Perfil'
    }

    ngOnInit(){
        console.log("ProfileComponent.component cargado");
    }
    
}