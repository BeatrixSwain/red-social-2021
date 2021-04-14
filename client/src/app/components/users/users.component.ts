import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follows.service';

import { GLOBAL } from '../../services/global';


@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css'],
    providers: [UserService, FollowService]

})

export class UsersComponent implements OnInit {
    public title: string;
    public token: any;
    public identity: any;
    public page: any;
    public next_page: any;
    public pre_page: any;
    public status: string;
    public users: any;
    public total: any;
    public totalPages: any;
    public url: string;
    public follows:any;
    public followUserOver:any;

    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _followService: FollowService) {
        this.title = "Gente";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.status = "";
        this.url = GLOBAL.url;

    }

    ngOnInit() {
        console.log('Componente de Users cargado...');
        this.actualPage();
    }

    actualPage() {
        this._route.params.subscribe(params => {
            let page = 1;
            if (params['page'] != undefined) {
                page = +params['page'];//Con el signo más delante es para convertirlo el número                
            }
            this.page = page;

            if (!page) {
                page = 1;
                this.page = 1;
            } else {
                this.next_page = page + 1;
                this.pre_page = page - 1;
                if (this.pre_page <= 0) {
                    this.pre_page = 1;
                }
            }

            //Devolver listado de usuarios
            this.getUsers(this.page);
        });
    }

    getUsers(page: any) {
        this._userService.getUsers(page).subscribe(
            response => {
                if (!response.users) {
                    console.log(response);
                    this.status = 'error';
                } else {
                    // console.log(response);
                    this.total = response.total;
                    this.totalPages = response.pages;
                    this.users = response.users;
                    this.follows = response.users_following;
                    if (page > this.totalPages) {
                        this._router.navigate(['/gente', 1]);
                    }
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }

        );
    }
    //
    mouseEnter(user_id:any){
        this.followUserOver=user_id;
    }

    mouseLeave(user_id:any){
        this.followUserOver=0;
    }

    followUser(followed:any){
        var follow = new Follow('', this.identity._id, followed);
        this._followService.addFollow(this.token, follow).subscribe(
            response=>{
                if(!response.follow){
                    this.status = 'error';
                }else{
                    this.status = 'success';
                    this.follows.push(followed);
                }
            },
            error=>{
                var errorMessage = <any>error;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );

    }

    unfollowUser(followed:any){
        this._followService.deleteFollow(this.token, followed).subscribe(
            response=>{
                if(!response.message){
                    this.status = 'error';
                }else{
                    this.status = 'success';
                    var search = this.follows.indexOf(followed);
                    if(search!=-1){
                        this.follows.splice(search, 1);
                    }
                }
            },
            error=>{
                var errorMessage = <any>error;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );

    }

}