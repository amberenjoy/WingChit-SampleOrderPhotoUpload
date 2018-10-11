import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import { OrderPage } from '../order/order';

// @IonicPage()
@Component({
  selector: 'page-orderlist',
  templateUrl: 'orderlist.html',
})
export class OrderlistPage {
  client:string;
  searchQuery: string = '';
  orders: any;
  itemsOriginal:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public platform: Platform) {
    this.client = navParams.get('clientName');
    this.initializeorder();
    platform.registerBackButtonAction(() => {
      if (navCtrl.canGoBack()) { // CHECK IF THE USER IS IN THE ROOT PAGE.
        navCtrl.pop(); // IF IT'S NOT THE ROOT, POP A PAGE.
      } else {
        platform.exitApp(); // IF IT'S THE ROOT, EXIT THE APP.
      }
    });
  }
  initializeorder(){
    this.orders =this.navParams.get('orderlist');
    console.log(this.orders);
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    // set val to the value of the searchbar
    const val = ev.target.value;
    this.initializeorder();
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.orders= this.orders.filter((item) => {
        return (item.id.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  getOrder(id,type,clientName,colorsList){
  	this.navCtrl.push(OrderPage,{orderId:id,typeList: type,clientName:clientName,colorsList:colorsList});
  }
}
