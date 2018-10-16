import { Component } from '@angular/core';
import { LoginPage } from '../login/login';
// import { ContactPage } from '../contact/contact';
import { ClientlistPage } from '../clientlist/clientlist';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab2Root = LoginPage;
  tab3Root = ClientlistPage;
  constructor() {

  }
}
