import { Component } from '@angular/core';
import { NavController,NavParams,Platform} from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import {ModalPage} from '../modal/modal';
@Component({
  selector: 'page-contact',
  templateUrl: 'order.html'
})

export class OrderPage {
  orderID: any;
  collections: object;
  clientName:string;  
  colors: any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController,public platform: Platform) {
    this.orderID=navParams.get("orderId");
    this.collections =navParams.get("typeList");
    this.clientName=navParams.get('clientName');
    this.colors=navParams.get('colorsList');
    platform.registerBackButtonAction(() => {
      if (navCtrl.canGoBack()) { // CHECK IF THE USER IS IN THE ROOT PAGE.
        navCtrl.pop(); // IF IT'S NOT THE ROOT, POP A PAGE.
      }
    });
  }
  presentModal(typeId,orderID,clientName,colors) {
    const modal = this.modalCtrl.create(ModalPage,{typeId: typeId,orderID: orderID,clientName:clientName,colorsList:colors});
    modal.present();
  }
}


