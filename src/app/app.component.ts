import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormArray} from '@angular/forms';
import {NgForOf} from "@angular/common";
// @ts-ignore
import jStat from "jstat";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  fg: FormGroup;
  engine: String[];
  deck: FormArray;
  actualdecklist: String[];
  starter_count: number;
  extender_count: number;
  board_breaker_count: number;
  handtrap_count: number;
  engine_req_count: number;
  nonengine_count: number;
  engine_count: number;
  starterResults: number[][];
  starterResults2: number[][];
  extenderResults: number[][];
  extenderResults2: number[][];
  handtrapResults: number[][];
  handtrapResults2: number[][];
  enginereqResults: number[][];
  enginereqResults2: number[][];

  constructor(
    private formBuilder: FormBuilder
  ){
    this.engine = ['Engine',
      'Non-Engine']

    this.actualdecklist = [];
    this.starter_count = 0;
    this.extender_count = 0;
    this.board_breaker_count = 0;
    this.handtrap_count = 0;
    this.engine_req_count = 0;
    this.nonengine_count = 0;
    this.engine_count = 0;
    this.starterResults = [];
    this.starterResults2 = [];
    this.extenderResults = [];
    this.extenderResults2 = [];
    this.handtrapResults = [];
    this.handtrapResults2 = [];
    this.enginereqResults = [];
    this.enginereqResults2 = [];


    const decklist = [];
    decklist.push(this.formBuilder.group({
      cardname:'',
      cardquantity:0,
      starter:false,
      extender:false,
      handtrap:false,
      enginereq:false,
      boardbreaker:false,
      engine:''
    }))
    this.deck = this.formBuilder.array(decklist);

    this.fg = this.formBuilder.group({
      deck : this.deck
    });
  }

  ngOnInit(): void {

  }

  onSubmit(e: Event) {
    this.clearResults();
    this.prepForAnalysis();
    this.AnalyzeStarters();
    this.AnalyzeExtenders();
    this.AnalyzeHandtraps();
    this.AnalyzeEngineReq()
  }

  AddNewRow() {
    this.deck = this.fg.get('deck') as FormArray
    this.deck.push(this.CreateNewRow());
  }
  CreateNewRow(){
    return this.formBuilder.group({
      cardname:'',
      cardquantity:0,
      starter:false,
      extender:false,
      handtrap:false,
      enginereq:false,
      boardbreaker:false,
      engine:"Engine"
    });
  }

  prepForAnalysis() {
    let cardname;
    let quantity;
    let is_starter;
    let is_extender;
    let is_handtrap;
    let is_enginereq;
    let is_boardbreaker;
    let engine_or_nonengine;
    this.deck = this.fg.get('deck') as FormArray
    for (let card of this.deck.controls) {
      cardname = card.get('cardname')?.getRawValue() as String;
      quantity = card.get('cardquantity')?.getRawValue() as number;
      is_starter = card.get('starter')?.getRawValue() as boolean;
      is_extender = card.get('extender')?.getRawValue() as boolean;
      is_handtrap = card.get('handtrap')?.getRawValue() as boolean;
      is_enginereq = card.get('enginereq')?.getRawValue() as boolean;
      is_boardbreaker = card.get('boardbreaker')?.getRawValue() as boolean;
      engine_or_nonengine = card.get('engine')?.getRawValue() as String;
      for (let i=0;i<quantity; i++){
        this.actualdecklist.push(cardname);
      }
      if(is_starter){
        this.starter_count += quantity;
      }
      if(is_extender){
        this.extender_count += quantity;
      }
      if(is_handtrap){
        this.handtrap_count += quantity;
      }
      if(is_enginereq){
        this.engine_req_count += quantity;
      }
      if(is_boardbreaker){
        this.board_breaker_count += quantity;
      }
      if(engine_or_nonengine == 'Engine'){
        this.engine_count += quantity;
      } else {
        this.nonengine_count += quantity;
      }
    }
  }

  PerformHGD(required_amount_of_successes:number,possible_successes:number,chances_at_success:number,total_values:number){
    return ((jStat.hypgeom.pdf(required_amount_of_successes,total_values,possible_successes,chances_at_success))*100).toFixed(2);
  }

  clearResults(){
    this.actualdecklist = [];
    this.starter_count = 0;
    this.extender_count = 0;
    this.board_breaker_count = 0;
    this.handtrap_count = 0;
    this.engine_req_count = 0;
    this.nonengine_count = 0;
    this.engine_count = 0;
    this.starterResults = [];
    this.starterResults2 = [];
    this.extenderResults = [];
    this.extenderResults2 = [];
    this.handtrapResults = [];
    this.handtrapResults2 = [];
    this.enginereqResults = [];
    this.enginereqResults2 = [];
  }

  AnalyzeStarters(){
    this.starterResults.push([1,Number(this.PerformHGD(1, this.starter_count, 5, this.actualdecklist.length))]);
    this.starterResults.push([2,Number(this.PerformHGD(2, this.starter_count, 5, this.actualdecklist.length))]);
    this.starterResults.push([3,Number(this.PerformHGD(3, this.starter_count, 5, this.actualdecklist.length))]);
    this.starterResults.push([4,Number(this.PerformHGD(4, this.starter_count, 5, this.actualdecklist.length))]);
    this.starterResults.push([5,Number(this.PerformHGD(5, this.starter_count, 5, this.actualdecklist.length))]);

    this.starterResults2.push([1,Number(this.PerformHGD(1, this.starter_count, 6, this.actualdecklist.length))]);
    this.starterResults2.push([2,Number(this.PerformHGD(2, this.starter_count, 6, this.actualdecklist.length))]);
    this.starterResults2.push([3,Number(this.PerformHGD(3, this.starter_count, 6, this.actualdecklist.length))]);
    this.starterResults2.push([4,Number(this.PerformHGD(4, this.starter_count, 6, this.actualdecklist.length))]);
    this.starterResults2.push([5,Number(this.PerformHGD(5, this.starter_count, 6, this.actualdecklist.length))]);
    this.starterResults2.push([6,Number(this.PerformHGD(6, this.starter_count, 6, this.actualdecklist.length))]);
  }
  AnalyzeExtenders(){
    this.extenderResults.push([1,Number(this.PerformHGD(1, this.extender_count, 5, this.actualdecklist.length))]);
    this.extenderResults.push([2,Number(this.PerformHGD(2, this.extender_count, 5, this.actualdecklist.length))]);
    this.extenderResults.push([3,Number(this.PerformHGD(3, this.extender_count, 5, this.actualdecklist.length))]);
    this.extenderResults.push([4,Number(this.PerformHGD(4, this.extender_count, 5, this.actualdecklist.length))]);
    this.extenderResults.push([5,Number(this.PerformHGD(5, this.extender_count, 5, this.actualdecklist.length))]);

    this.extenderResults2.push([1,Number(this.PerformHGD(1, this.extender_count, 6, this.actualdecklist.length))]);
    this.extenderResults2.push([2,Number(this.PerformHGD(2, this.extender_count, 6, this.actualdecklist.length))]);
    this.extenderResults2.push([3,Number(this.PerformHGD(3, this.extender_count, 6, this.actualdecklist.length))]);
    this.extenderResults2.push([4,Number(this.PerformHGD(4, this.extender_count, 6, this.actualdecklist.length))]);
    this.extenderResults2.push([5,Number(this.PerformHGD(5, this.extender_count, 6, this.actualdecklist.length))]);
    this.extenderResults2.push([6,Number(this.PerformHGD(6, this.extender_count, 6, this.actualdecklist.length))]);
  }
  AnalyzeHandtraps(){
    this.handtrapResults.push([1,Number(this.PerformHGD(1, this.handtrap_count, 5, this.actualdecklist.length))]);
    this.handtrapResults.push([2,Number(this.PerformHGD(2, this.handtrap_count, 5, this.actualdecklist.length))]);
    this.handtrapResults.push([3,Number(this.PerformHGD(3, this.handtrap_count, 5, this.actualdecklist.length))]);
    this.handtrapResults.push([4,Number(this.PerformHGD(4, this.handtrap_count, 5, this.actualdecklist.length))]);
    this.handtrapResults.push([5,Number(this.PerformHGD(5, this.handtrap_count, 5, this.actualdecklist.length))]);

    this.handtrapResults2.push([1,Number(this.PerformHGD(1, this.handtrap_count, 6, this.actualdecklist.length))]);
    this.handtrapResults2.push([2,Number(this.PerformHGD(2, this.handtrap_count, 6, this.actualdecklist.length))]);
    this.handtrapResults2.push([3,Number(this.PerformHGD(3, this.handtrap_count, 6, this.actualdecklist.length))]);
    this.handtrapResults2.push([4,Number(this.PerformHGD(4, this.handtrap_count, 6, this.actualdecklist.length))]);
    this.handtrapResults2.push([5,Number(this.PerformHGD(5, this.handtrap_count, 6, this.actualdecklist.length))]);
    this.handtrapResults2.push([6,Number(this.PerformHGD(6, this.handtrap_count, 6, this.actualdecklist.length))]);
  }
  AnalyzeEngineReq(){
    this.enginereqResults.push([1,Number(this.PerformHGD(1, this.engine_req_count, 5, this.actualdecklist.length))]);
    this.enginereqResults.push([2,Number(this.PerformHGD(2, this.engine_req_count, 5, this.actualdecklist.length))]);
    this.enginereqResults.push([3,Number(this.PerformHGD(3, this.engine_req_count, 5, this.actualdecklist.length))]);
    this.enginereqResults.push([4,Number(this.PerformHGD(4, this.engine_req_count, 5, this.actualdecklist.length))]);
    this.enginereqResults.push([5,Number(this.PerformHGD(5, this.engine_req_count, 5, this.actualdecklist.length))]);

    this.enginereqResults2.push([1,Number(this.PerformHGD(1, this.engine_req_count, 6, this.actualdecklist.length))]);
    this.enginereqResults2.push([2,Number(this.PerformHGD(2, this.engine_req_count, 6, this.actualdecklist.length))]);
    this.enginereqResults2.push([3,Number(this.PerformHGD(3, this.engine_req_count, 6, this.actualdecklist.length))]);
    this.enginereqResults2.push([4,Number(this.PerformHGD(4, this.engine_req_count, 6, this.actualdecklist.length))]);
    this.enginereqResults2.push([5,Number(this.PerformHGD(5, this.engine_req_count, 6, this.actualdecklist.length))]);
    this.enginereqResults2.push([6,Number(this.PerformHGD(6, this.engine_req_count, 6, this.actualdecklist.length))]);
  }
}

