import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthGuard } from 'src/app/providers/auth.guard';
import { EventEmitterService } from 'src/app/providers/eventEmitter.provider';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUrl: any;
  constructor(private router: Router, private authGuard: AuthGuard, private emitter: EventEmitterService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
    this.emitter.profile.subscribe({
      next: ({ user }: any) => {
        localStorage.setItem('user', JSON.stringify(user))
        this.getUser()
      }
    })
  }
  dropdownButton: any
  menuOpened: boolean = false;
  user: any = {};
  ngOnInit(): void {

    const dropdownMenu = document.getElementById('navbarDropdown');
    document.addEventListener('click', (event: any) => {
      const isClickInsideMenu = dropdownMenu?.contains(event.target);
      if (!isClickInsideMenu) {
        this.menuOpened = false;
      }
    });
    this.getUser()
  }
  logout() {
    this.authGuard.logout()
  }
  getUser() {
    let userString = localStorage.getItem('user');
    this.user = JSON.parse(userString + "");

  }
}
