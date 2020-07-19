import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';

import { AppComponent } from './app.component';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';



@NgModule({
  declarations: [
    AppComponent,
    NoPageFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    PagesModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
