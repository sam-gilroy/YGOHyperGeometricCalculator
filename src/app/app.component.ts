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
  boardbreakerResults: number[][];
  boardbreakerResults2: number[][];
  engineResults: number[][];
  engineResults2: number[][];
  nonengineResults: number[][];
  nonengineResults2: number[][];
  at_least_one_starter: number;
  at_least_one_extender: number;
  at_least_one_handtrap: number;
  at_least_one_enginereq: number;
  at_least_one_boardbreaker: number;
  at_least_one_engine: number;
  at_least_one_nonengine: number;
  at_least_one_starter2: number;
  at_least_one_extender2: number;
  at_least_one_handtrap2: number;
  at_least_one_enginereq2: number;
  at_least_one_boardbreaker2: number;
  at_least_one_engine2: number;
  at_least_one_nonengine2: number;
  gloss: HTMLElement | null;

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
    this.boardbreakerResults = [];
    this.boardbreakerResults2 = [];
    this.engineResults = [];
    this.engineResults2 = [];
    this.nonengineResults = [];
    this.nonengineResults2 = [];
    this.at_least_one_starter = 0;
    this.at_least_one_extender = 0;
    this.at_least_one_handtrap = 0;
    this.at_least_one_enginereq = 0;
    this.at_least_one_boardbreaker = 0;
    this.at_least_one_engine = 0;
    this.at_least_one_nonengine = 0;
    this.at_least_one_starter2 = 0;
    this.at_least_one_extender2 = 0;
    this.at_least_one_handtrap2 = 0;
    this.at_least_one_enginereq2 = 0;
    this.at_least_one_boardbreaker2 = 0;
    this.at_least_one_engine2 = 0;
    this.at_least_one_nonengine2 = 0;
    this.gloss = document.getElementById('glossary');
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
    this.gloss = document.getElementById('glossary');
    // @ts-ignore
    this.gloss.hidden = true;
  }

  onSubmit(e: EventTarget | null) {
    // @ts-ignore
    console.log(e.id);
    // @ts-ignore
    if(e.id == "submit") {
      this.clearResults();
      this.prepForAnalysis();
      this.AnalyzeStarters();
      this.AnalyzeExtenders();
      this.AnalyzeHandtraps();
      this.AnalyzeEngineReq();
      this.AnalyzeBoardBreakers();
      this.AnalyzeEngine();
      this.AnalyzeNonEngine();
    }
  }

  AddNewRow(target: EventTarget | null) {
    // @ts-ignore
    if (target.id == "newRow") {
      this.deck = this.fg.get('deck') as FormArray
      this.deck.push(this.CreateNewRow());
    }
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
    this.boardbreakerResults = [];
    this.boardbreakerResults2 = [];
    this.engineResults = [];
    this.engineResults2 = [];
    this.nonengineResults = [];
    this.nonengineResults2 = [];
    this.at_least_one_starter = 0;
    this.at_least_one_extender = 0;
    this.at_least_one_handtrap = 0;
    this.at_least_one_enginereq = 0;
    this.at_least_one_boardbreaker = 0;
    this.at_least_one_engine = 0;
    this.at_least_one_nonengine = 0;
    this.at_least_one_starter2 = 0;
    this.at_least_one_extender2 = 0;
    this.at_least_one_handtrap2 = 0;
    this.at_least_one_enginereq2 = 0;
    this.at_least_one_boardbreaker2 = 0;
    this.at_least_one_engine2 = 0;
    this.at_least_one_nonengine2 = 0;
  }

  AnalyzeStarters(){
    let s1 = Number(this.PerformHGD(1, this.starter_count, 5, this.actualdecklist.length));
    let s2 = Number(this.PerformHGD(2, this.starter_count, 5, this.actualdecklist.length));
    let s3 = Number(this.PerformHGD(3, this.starter_count, 5, this.actualdecklist.length));
    let s4 = Number(this.PerformHGD(4, this.starter_count, 5, this.actualdecklist.length));
    let s5 = Number(this.PerformHGD(5, this.starter_count, 5, this.actualdecklist.length));
    this.at_least_one_starter = Number((s1+s2+s3+s4+s5).toFixed(2));
    this.starterResults.push([1,s1]);
    this.starterResults.push([2,s2]);
    this.starterResults.push([3,s3]);
    this.starterResults.push([4,s4]);
    this.starterResults.push([5,s5]);

    let s2_1 = Number(this.PerformHGD(1, this.starter_count, 6, this.actualdecklist.length));
    let s2_2 = Number(this.PerformHGD(2, this.starter_count, 6, this.actualdecklist.length));
    let s2_3 = Number(this.PerformHGD(3, this.starter_count, 6, this.actualdecklist.length));
    let s2_4 = Number(this.PerformHGD(4, this.starter_count, 6, this.actualdecklist.length));
    let s2_5 = Number(this.PerformHGD(5, this.starter_count, 6, this.actualdecklist.length));
    let s2_6 = Number(this.PerformHGD(6, this.starter_count, 6, this.actualdecklist.length));
    this.at_least_one_starter2 = Number((s2_1+s2_2+s2_3+s2_4+s2_5+s2_6).toFixed(2));
    this.starterResults2.push([1,s2_1]);
    this.starterResults2.push([2,s2_2]);
    this.starterResults2.push([3,s2_3]);
    this.starterResults2.push([4,s2_4]);
    this.starterResults2.push([5,s2_5]);
    this.starterResults2.push([6,s2_6]);
  }
  AnalyzeExtenders(){
    let e1 = Number(this.PerformHGD(1, this.extender_count, 5, this.actualdecklist.length));
    let e2 = Number(this.PerformHGD(2, this.extender_count, 5, this.actualdecklist.length));
    let e3 = Number(this.PerformHGD(3, this.extender_count, 5, this.actualdecklist.length));
    let e4 = Number(this.PerformHGD(4, this.extender_count, 5, this.actualdecklist.length));
    let e5 = Number(this.PerformHGD(5, this.extender_count, 5, this.actualdecklist.length));
    this.at_least_one_extender = Number((e1+e2+e3+e4+e5).toFixed(2));
    this.extenderResults.push([1,e1]);
    this.extenderResults.push([2,e2]);
    this.extenderResults.push([3,e3]);
    this.extenderResults.push([4,e4]);
    this.extenderResults.push([5,e5]);

    let e2_1 = Number(this.PerformHGD(1, this.extender_count, 6, this.actualdecklist.length));
    let e2_2 = Number(this.PerformHGD(2, this.extender_count, 6, this.actualdecklist.length));
    let e2_3 = Number(this.PerformHGD(3, this.extender_count, 6, this.actualdecklist.length));
    let e2_4 = Number(this.PerformHGD(4, this.extender_count, 6, this.actualdecklist.length));
    let e2_5 = Number(this.PerformHGD(5, this.extender_count, 6, this.actualdecklist.length));
    let e2_6 = Number(this.PerformHGD(6, this.extender_count, 6, this.actualdecklist.length));
    this.at_least_one_extender2 = Number((e2_1+e2_2+e2_3+e2_4+e2_5+e2_6).toFixed(2));
    this.extenderResults2.push([1,e2_1]);
    this.extenderResults2.push([2,e2_2]);
    this.extenderResults2.push([3,e2_3]);
    this.extenderResults2.push([4,e2_4]);
    this.extenderResults2.push([5,e2_5]);
    this.extenderResults2.push([6,e2_6]);
  }
  AnalyzeHandtraps(){
    let h1= Number(this.PerformHGD(1, this.handtrap_count, 5, this.actualdecklist.length));
    let h2= Number(this.PerformHGD(2, this.handtrap_count, 5, this.actualdecklist.length));
    let h3= Number(this.PerformHGD(3, this.handtrap_count, 5, this.actualdecklist.length));
    let h4= Number(this.PerformHGD(4, this.handtrap_count, 5, this.actualdecklist.length));
    let h5= Number(this.PerformHGD(5, this.handtrap_count, 5, this.actualdecklist.length));
    this.at_least_one_handtrap = Number((h1+h2+h3+h4+h5).toFixed(2));
    this.handtrapResults.push([1,h1]);
    this.handtrapResults.push([2,h2]);
    this.handtrapResults.push([3,h3]);
    this.handtrapResults.push([4,h4]);
    this.handtrapResults.push([5,h5]);

    let h2_1 = Number(this.PerformHGD(1, this.handtrap_count, 6, this.actualdecklist.length));
    let h2_2 = Number(this.PerformHGD(2, this.handtrap_count, 6, this.actualdecklist.length));
    let h2_3 = Number(this.PerformHGD(3, this.handtrap_count, 6, this.actualdecklist.length));
    let h2_4 = Number(this.PerformHGD(4, this.handtrap_count, 6, this.actualdecklist.length));
    let h2_5 = Number(this.PerformHGD(5, this.handtrap_count, 6, this.actualdecklist.length));
    let h2_6 = Number(this.PerformHGD(6, this.handtrap_count, 6, this.actualdecklist.length));
    this.at_least_one_handtrap2 = Number((h2_1+h2_2+h2_3+h2_4+h2_5+h2_6).toFixed(2));
    this.handtrapResults2.push([1,h2_1]);
    this.handtrapResults2.push([2,h2_2]);
    this.handtrapResults2.push([3,h2_3]);
    this.handtrapResults2.push([4,h2_4]);
    this.handtrapResults2.push([5,h2_5]);
    this.handtrapResults2.push([6,h2_6]);
  }
  AnalyzeEngineReq(){
    let er1 = Number(this.PerformHGD(1, this.engine_req_count, 5, this.actualdecklist.length));
    let er2 = Number(this.PerformHGD(2, this.engine_req_count, 5, this.actualdecklist.length));
    let er3 = Number(this.PerformHGD(3, this.engine_req_count, 5, this.actualdecklist.length));
    let er4 = Number(this.PerformHGD(4, this.engine_req_count, 5, this.actualdecklist.length));
    let er5 = Number(this.PerformHGD(5, this.engine_req_count, 5, this.actualdecklist.length));
    this.at_least_one_enginereq = Number((er1+er2+er3+er4+er5).toFixed(2));
    this.enginereqResults.push([1,er1]);
    this.enginereqResults.push([2,er2]);
    this.enginereqResults.push([3,er3]);
    this.enginereqResults.push([4,er4]);
    this.enginereqResults.push([5,er5]);

    let er2_1 = Number(this.PerformHGD(1, this.engine_req_count, 6, this.actualdecklist.length));
    let er2_2 = Number(this.PerformHGD(2, this.engine_req_count, 6, this.actualdecklist.length));
    let er2_3 = Number(this.PerformHGD(3, this.engine_req_count, 6, this.actualdecklist.length));
    let er2_4 = Number(this.PerformHGD(4, this.engine_req_count, 6, this.actualdecklist.length));
    let er2_5 = Number(this.PerformHGD(5, this.engine_req_count, 6, this.actualdecklist.length));
    let er2_6 = Number(this.PerformHGD(6, this.engine_req_count, 6, this.actualdecklist.length));
    this.at_least_one_enginereq2 = Number((er2_1+er2_2+er2_3+er2_4+er2_5+er2_6).toFixed(2));
    this.enginereqResults2.push([1,er2_1]);
    this.enginereqResults2.push([2,er2_2]);
    this.enginereqResults2.push([3,er2_3]);
    this.enginereqResults2.push([4,er2_4]);
    this.enginereqResults2.push([5,er2_5]);
    this.enginereqResults2.push([6,er2_6]);
  }
  AnalyzeBoardBreakers(){
    let bb1 = Number(this.PerformHGD(1, this.board_breaker_count, 5, this.actualdecklist.length));
    let bb2 = Number(this.PerformHGD(2, this.board_breaker_count, 5, this.actualdecklist.length));
    let bb3 = Number(this.PerformHGD(3, this.board_breaker_count, 5, this.actualdecklist.length));
    let bb4 = Number(this.PerformHGD(4, this.board_breaker_count, 5, this.actualdecklist.length));
    let bb5 = Number(this.PerformHGD(5, this.board_breaker_count, 5, this.actualdecklist.length));
    this.at_least_one_boardbreaker = Number((bb1+bb2+bb3+bb4+bb5).toFixed(2));
    this.boardbreakerResults.push([1,bb1]);
    this.boardbreakerResults.push([2,bb2]);
    this.boardbreakerResults.push([3,bb3]);
    this.boardbreakerResults.push([4,bb4]);
    this.boardbreakerResults.push([5,bb5]);

    let bb2_1 = Number(this.PerformHGD(1, this.board_breaker_count, 6, this.actualdecklist.length));
    let bb2_2 = Number(this.PerformHGD(2, this.board_breaker_count, 6, this.actualdecklist.length));
    let bb2_3 = Number(this.PerformHGD(3, this.board_breaker_count, 6, this.actualdecklist.length));
    let bb2_4 = Number(this.PerformHGD(4, this.board_breaker_count, 6, this.actualdecklist.length));
    let bb2_5 = Number(this.PerformHGD(5, this.board_breaker_count, 6, this.actualdecklist.length));
    let bb2_6 = Number(this.PerformHGD(6, this.board_breaker_count, 6, this.actualdecklist.length));
    this.at_least_one_boardbreaker2 = Number((bb2_1+bb2_2+bb2_3+bb2_4+bb2_5+bb2_6).toFixed(2));
    this.boardbreakerResults2.push([1,bb2_1]);
    this.boardbreakerResults2.push([2,bb2_2]);
    this.boardbreakerResults2.push([3,bb2_3]);
    this.boardbreakerResults2.push([4,bb2_4]);
    this.boardbreakerResults2.push([5,bb2_5]);
    this.boardbreakerResults2.push([6,bb2_6]);
  }
  AnalyzeEngine(){
    let eng1 = Number(this.PerformHGD(1, this.engine_count, 5, this.actualdecklist.length));
    let eng2 = Number(this.PerformHGD(2, this.engine_count, 5, this.actualdecklist.length));
    let eng3 = Number(this.PerformHGD(3, this.engine_count, 5, this.actualdecklist.length));
    let eng4 = Number(this.PerformHGD(4, this.engine_count, 5, this.actualdecklist.length));
    let eng5 = Number(this.PerformHGD(5, this.engine_count, 5, this.actualdecklist.length));
    this.at_least_one_engine = Number((eng1+eng2+eng3+eng4+eng5).toFixed(2));
    this.engineResults.push([1,eng1]);
    this.engineResults.push([2,eng2]);
    this.engineResults.push([3,eng3]);
    this.engineResults.push([4,eng4]);
    this.engineResults.push([5,eng5]);

    let eng2_1 = Number(this.PerformHGD(1, this.engine_count, 6, this.actualdecklist.length));
    let eng2_2 = Number(this.PerformHGD(2, this.engine_count, 6, this.actualdecklist.length));
    let eng2_3 = Number(this.PerformHGD(3, this.engine_count, 6, this.actualdecklist.length));
    let eng2_4 = Number(this.PerformHGD(4, this.engine_count, 6, this.actualdecklist.length));
    let eng2_5 = Number(this.PerformHGD(5, this.engine_count, 6, this.actualdecklist.length));
    let eng2_6 = Number(this.PerformHGD(6, this.engine_count, 6, this.actualdecklist.length));
    this.at_least_one_engine2 = Number((eng2_1+eng2_2+eng2_3+eng2_4+eng2_5+eng2_6).toFixed(2));
    this.engineResults2.push([1,eng2_1]);
    this.engineResults2.push([2,eng2_2]);
    this.engineResults2.push([3,eng2_3]);
    this.engineResults2.push([4,eng2_4]);
    this.engineResults2.push([5,eng2_5]);
    this.engineResults2.push([6,eng2_6]);
  }
  AnalyzeNonEngine(){
    let noneng1 = Number(this.PerformHGD(1, this.nonengine_count, 5, this.actualdecklist.length));
    let noneng2 = Number(this.PerformHGD(2, this.nonengine_count, 5, this.actualdecklist.length));
    let noneng3 = Number(this.PerformHGD(3, this.nonengine_count, 5, this.actualdecklist.length));
    let noneng4 = Number(this.PerformHGD(4, this.nonengine_count, 5, this.actualdecklist.length));
    let noneng5 = Number(this.PerformHGD(5, this.nonengine_count, 5, this.actualdecklist.length));
    this.at_least_one_nonengine = Number((noneng1+noneng2+noneng3+noneng4+noneng5).toFixed(2));
    this.nonengineResults.push([1,noneng1]);
    this.nonengineResults.push([2,noneng2]);
    this.nonengineResults.push([3,noneng3]);
    this.nonengineResults.push([4,noneng4]);
    this.nonengineResults.push([5,noneng5]);

    let noneng2_1 = Number(this.PerformHGD(1, this.nonengine_count, 6, this.actualdecklist.length));
    let noneng2_2 = Number(this.PerformHGD(2, this.nonengine_count, 6, this.actualdecklist.length));
    let noneng2_3 = Number(this.PerformHGD(3, this.nonengine_count, 6, this.actualdecklist.length));
    let noneng2_4 = Number(this.PerformHGD(4, this.nonengine_count, 6, this.actualdecklist.length));
    let noneng2_5 = Number(this.PerformHGD(5, this.nonengine_count, 6, this.actualdecklist.length));
    let noneng2_6 = Number(this.PerformHGD(6, this.nonengine_count, 6, this.actualdecklist.length));
    this.at_least_one_nonengine2 = Number((noneng2_1+noneng2_2+noneng2_3+noneng2_4+noneng2_5+noneng2_6).toFixed(2));
    this.nonengineResults2.push([1,noneng2_1]);
    this.nonengineResults2.push([2,noneng2_2]);
    this.nonengineResults2.push([3,noneng2_3]);
    this.nonengineResults2.push([4,noneng2_4]);
    this.nonengineResults2.push([5,noneng2_5]);
    this.nonengineResults2.push([6,noneng2_6]);
  }

  showGloss(target: EventTarget | null) {
    // @ts-ignore
    if (target.id == "ShowG") {
      // @ts-ignore
      if (this.gloss.checkVisibility()) {
        // @ts-ignore
        this.gloss.hidden = true;
      } else {
        // @ts-ignore
        this.gloss.hidden = false;
      }
    }
  }
}



