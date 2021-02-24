//Modelo de usuario - 08.02.2021

export class User{
    constructor(
        public name: String,
        public surname: String,
        public nick: String,
        public email: String,
        public password: String,
        public role: String,
        public image: String,
      //  public gettoken:any
    ){

    }
}