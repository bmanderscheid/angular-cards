import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GameComponent } from './game.component';

import { GameService } from './game.service';
import { CardService } from './card.service';


@NgModule({
  imports: [BrowserModule, HttpModule],
  declarations: [AppComponent, GameComponent],
  bootstrap: [AppComponent],
  providers: [GameService, CardService]
})
export class AppModule { }
