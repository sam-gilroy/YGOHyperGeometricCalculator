import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  fg: FormGroup;
  cardtypes: String[];

  constructor(
    private formBuilder: FormBuilder
  ){
    this.fg = new FormGroup({});
    this.cardtypes = ['Starter',
      'Extender',
      'Utility',
      'Hand Trap',
      'Engine Requirement',
      'Non Engine']
  }

  ngOnInit(): void {
  this.fg = this.formBuilder.group({});
  }

  onSubmit(e: Event) {

  }

}
