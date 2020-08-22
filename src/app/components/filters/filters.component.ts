import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {FilterAds} from '../../shared/models/filterAds.model';
import {Ads} from '../../shared/models/ads.model';
import cantons from '../../shared/cantons.json';
import {AdsService} from '../../@core/services/ads.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {HelpersService} from '../../@core/services/helpers.service';
import {TranslateServiceRest} from '../../@core/services/translateREST.service';
import {Subscription} from 'rxjs';
import {response} from 'express';
import {adsSubGroup} from '../../shared/models/adsSubGroup.model';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {


  fixedPrice = false;
  hasImage = false;
  freeDelivery = false;
  productWarranty = false;
  urgentSales = false;
  reg: string;
  error = false;
  errorMessage;

  fromPrice: number;
  toPrice: number;

  all: boolean;
  used: boolean;
  new: boolean;
  public filterAd: FilterAds;

  cantons = cantons;
  formattedAmount;
  amount;
  categoriesGroup;
  subCategoriesGroup;
  category = {
    id: 0,
    groupName: ''
  };
  subCategory = {
    id: 0,
    subGroupName: ''
  };

  noCategory = '';
  noSubCategory = '';
  noRegion = '';
  currentLang = 'de';
  subscriptionLang: Subscription;


  constructor(
    private adsService: AdsService,
    private router: Router,
    private translateBackend: TranslateServiceRest) {

    this.subscriptionLang = this.translateBackend.getLanguage().subscribe(message => {
      this.currentLang = message;
    });
  }

  ngOnInit() {
    this.fromPrice = 1;
    this.toPrice = 100;
    this.adsService.getAllAdsGroups().subscribe(x => {
      this.categoriesGroup = x;
      this.category.groupName = this.categoriesGroup[0].groupName;
      this.category.id = this.categoriesGroup[0].id;
    });
    this.reg = cantons[0];
    this.all = true;

    this.subscriptionLang = this.translateBackend
      .getLanguage()
      .subscribe((message) => {
        this.currentLang = message;
      });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscriptionLang.unsubscribe();
  }


  allButton() {
    this.all = true;
    this.new = false;
    this.used = false;

  }

  newButton() {
    this.all = false;
    this.new = true;
    this.used = false;

  }

  usedButton() {
    this.all = false;
    this.new = false;
    this.used = true;

  }

  findCategory(event: any): void {
    this.subCategoriesGroup = [];
    this.category.id = Number(event.target.value);
    // tslint:disable-next-line:no-shadowed-variable
    this.adsService.getAllAdsSubGroup(this.category.id).subscribe(response => {
      this.subCategoriesGroup = response;
      // this.subCategory.subGroupName = this.subCategoriesGroup[0].subGroupName;
      this.subCategory.id = this.subCategoriesGroup[0].id;
    });
  }

  confirmButton() {
    if (this.toPrice < this.fromPrice) {
      this.errorMessage = 'Max price cannot be bigger than minimum price';
      this.error = true;
      setTimeout(() => this.error = false, 5000);
    } else {
      this.filterAd = {
        region: this.reg,
        fromPrice: this.fromPrice,
        toPrice: this.toPrice,
        fixedPrice: this.fixedPrice,
        hasImage: this.hasImage,
        freeDelivery: this.freeDelivery,
        productWarranty: this.productWarranty,
        urgentSales: this.urgentSales,
        adsGroupId: this.category.id,
        subCategory: this.subCategory.id,
      };
      this.adsService.getAdsByParamToFilter(this.filterAd).subscribe(x => {
        if (x.length < 1) {
          this.error = true;
          setTimeout(() => this.error = false, 5000);
          this.errorMessage = 'No available ads to filter';
        } else {
          this.router.navigateByUrl('/site', {state: {data: x}});
        }
      });
    }
  }

}
