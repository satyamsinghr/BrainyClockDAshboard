import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/@shared/pipes/loader.service';


@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  loaderSubscription: Subscription | undefined;
  isLoading = false;

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    this.loaderSubscription = this.loaderService.status.subscribe((val: boolean) => {
      this.isLoading = val;
    });
  }
  ngOnDestroy(): void {
    if (this.loaderSubscription) this.loaderSubscription.unsubscribe();
  }

}
