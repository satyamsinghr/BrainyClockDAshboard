import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader/loader.component';
import { MainMaterialModule } from '../main-material/main-material.module';
import { StylePaginatorDirective } from './directive/style-paginator.directive';

@NgModule({
  declarations: [
  
    StylePaginatorDirective
  ],
  imports: [
    CommonModule,
    MainMaterialModule,
  ],
  exports: [LoaderComponent]
})
export class SharedModule { }
