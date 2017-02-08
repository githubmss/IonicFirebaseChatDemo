import { Component } from '@angular/core';
import { ChatsPage } from '../chats/chats'; 
import { AccountPage } from '../account/account';
import { UsersPage } from '../users/users';
import { NavController } from 'ionic-angular';


@Component({
	selector: 'tabs-page',
	templateUrl: 'tabs.html'
})
export class TabsPage {
  rootPage: any = UsersPage;
    pages: Array<{title: string, component: any}>;


 constructor(public nav: NavController) {
this.pages = [
      { title: 'Users', component: UsersPage },
      { title: 'Recent Chat', component: ChatsPage },
        { title: 'Account', component: AccountPage }
    ];

    }

	
	

     openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}