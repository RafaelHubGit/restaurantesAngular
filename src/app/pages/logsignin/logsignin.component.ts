import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logsignin',
  templateUrl: './logsignin.component.html',
  styleUrls: ['./logsignin.component.css']
})
export class LogsigninComponent implements OnInit {

  loginSign = true;

  constructor() { }

  ngOnInit(): void {
  }

}
