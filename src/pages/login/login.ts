import { Component } from '@angular/core';
import { NavController,App,Platform} from 'ionic-angular';
@Component({
  selector: 'page-about',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController,public app: App,public platform: Platform) {
    let nav = app.getActiveNav();
  	platform.registerBackButtonAction(()=>{
  		nav.parent.select(0); // IF IT'S THE ROOT, EXIT THE APP.
  	});
  }
  logout(){
  	// Remove API token 
    const root = this.app.getRootNav();
    root.popToRoot();
  }
}
