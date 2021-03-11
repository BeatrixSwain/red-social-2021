import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';


@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    providers: [UserService]

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

    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService) {
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
                    console.log(response);
                    this.total = response.total;
                    this.totalPages = response.pages;
                    this.users = response.users;
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
}