import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthGuard } from 'src/app/providers/auth.guard';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUrl: any;
  constructor(private router: Router, private authGuard: AuthGuard) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
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
    let userString = localStorage.getItem('user');
    this.user = JSON.parse(userString + "");

  }
  logout() {
    this.authGuard.logout()
  }
}
