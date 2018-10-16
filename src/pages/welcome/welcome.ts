import { Component } from '@angular/core';
import { NavController, NavParams,AlertController,Platform, App } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  updateUser:string=""; 
  constructor(public navCtrl: NavController,public app: App, public navParams: NavParams,  private storage: Storage,public alertCtrl: AlertController,public platform: Platform) {
      storage.get("updateUser").then((val) => {
        this.updateUser=val;
      });
      platform.registerBackButtonAction(() => {
        platform.exitApp();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }
 

  signIn(username: HTMLInputElement){
    // set a key/value
    if(username.value){
      this.updateUser=username.value;
      this.storage.set('updateUser', this.updateUser);
      this.navCtrl.push(TabsPage,{animate: false});
    }else{
      let alert = this.alertCtrl.create({title: "请输入用户名",buttons: ['确定']});
      alert.present();
    }

  }
  signUp(){
  	this.navCtrl.push(RegisterPage);
  }
}
