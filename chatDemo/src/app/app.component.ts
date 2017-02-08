import { Component ,ViewChild} from '@angular/core';
import { Nav,Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthProvider } from '../providers/auth-provider/auth-provider';
import { UsersPage } from '../pages/users/users';
import { ChatsPage } from '../pages/chats/chats';
import { AccountPage } from '../pages/account/account';
import { ProfilePage } from '../pages/profile/profile';




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

  rootPage:any;
    pages: Array<{title: string, component: any}>;


  constructor(platform: Platform, public af: AngularFire, public authProvider:AuthProvider) {
    this.pages = [
      { title: 'Users', component: UsersPage },
/*      { title: 'Recent Chat', component: ChatsPage },
*/              { title: 'Profile', component: ProfilePage },

        { title: 'Logout', component: AccountPage }
    ];
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      this.intialize();
    });
  }

  intialize() {
    this.af.auth.subscribe(auth => {
       if(auth) {
          this.rootPage = UsersPage;
        } else {
          this.rootPage = LoginPage;
        }
    });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
