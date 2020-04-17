import { Component, OnInit } from '@angular/core';
import { AuthmailService } from '../../services/authmail.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor( private auth: AuthmailService,
               private router: Router){}

  ngOnInit(): void {
  }


  abreMenu(){
    $('.sidenav').sidenav(
      {
        draggable: true
      }
    );
  }

  logout(){
    this.auth.logout()
              .then( resp => {
              }, err => {
              });
    this.router.navigateByUrl('/login');
  }

}
