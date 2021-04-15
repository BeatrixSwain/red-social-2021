import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Publication } from '../../models/publication'
import { GLOBAL } from '../../services/global';
import { PublicationService} from '../../services/publication.service'

@Component({
    selector: 'publications',
    templateUrl: './publications.component.html',
    styleUrls: ['../timeline/timeline.component.css'],
    providers: [UserService, PublicationService]

})

export class PublicationsComponent implements OnInit {
    public title: string;
    public token: any;
    public identity: any;    
    public url: string;
    public status: string;
    public page:number;
    public publications:Publication[];
    public totalPages:number;
    public totalItems:number;
    public itemsPerPage:number;
    public noMore = false;


    
    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _publicationService:PublicationService) {
        this.title = "publications";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.status = "";
        this.url = GLOBAL.url;
        this.page = 1;
        this.publications = [];
        this.totalPages = 0;
        this.totalItems= 0;
        this.itemsPerPage =0;

    }

    ngOnInit() {
        console.log('Componente de publications cargado...');
        this.getPublications(this.page);
    }

    getPublications(page:any,adding=false){
        this._publicationService.getPublications(this.token, page).subscribe(
            response=>{
                // console.log(response);
                if(response.publications){
                    this.itemsPerPage=response.itemsPerPage;
                    this.totalItems = response.total_items;
                    this.totalPages = response.pages;

                    if(!adding){
                        this.publications = response.publications;
                    }else{
                        let arrayA = this.publications;
                        let arrayB = response.publications;
                        this.publications = arrayA.concat(arrayB);
                        $("html, body").animate({scrollTop:$('body').prop("scrollHeight")},1000);
                    }
                    
                    if(this.publications.length>=this.totalItems){
                        this.noMore=true;
                    }
                  
                    // if(page>this.totalPages){
                    //     this._router.navigate(['/home']);
                    // }
                }else if(response.message){
                    console.log(response.message);
                    this.status = 'error';
                }else{
                    console.log(response);
                    this.status = 'error';
                }
            },
            error=>{
                var errorMessage= <any>error;
                console.log(errorMessage);
                if(errorMessage!=null){
                    this.status = 'error';
                }
            }
        );
    }

    viewMore(){
        this.page+=1;

         if(this.publications.length == (this.totalItems-this.itemsPerPage)){
            this.noMore=true;
         }
         this.getPublications(this.page, true);
    }
}