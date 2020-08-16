import { Component, Input, OnChanges } from '@angular/core';
import { Ads } from '../../../shared/models/ads.model';
import { AdsService } from '../../../@core/services/ads.service';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-account-active',
  templateUrl: './account-active.component.html',
  styleUrls: ['./account-active.component.scss'],
})
export class AccountActiveComponent implements OnChanges {
  @Input() activeProducts: Ads;
  @Input() ads: boolean;
  Ads: boolean;
  userId: number;
  lang: string;

  constructor(
    private modal: NzModalService,
    private notification: NzNotificationService,
    private adsService: AdsService
  ) {}

  ngOnChanges() {
    this.lang = localStorage.getItem('language');
    console.log(this.lang);
  }

  deleteAd(active: Ads, index: number): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this ad?',
      nzContent: '',
      nzOnOk: () => {
        this.activeProducts[0].splice(index, 1);
        if (this.activeProducts[0].length === 0) {
          this.ads = false;
        }
        const ads = new Ads();
        ads.adsDate = null;
        ads.adsLocation = null;
        ads.adsType = null;
        ads.adsgroupId = null;
        ads.adssubgropuId = null;
        ads.description = null;
        ads.favourite = null;
        ads.fixedPrice = null;
        ads.freeDelivery = null;
        ads.id = active.id;
        ads.image = null;
        ads.price = null;
        ads.productName = null;
        ads.productWarranty = null;
        ads.status = 'DELETE';
        ads.urgentSales = null;
        ads.userId = null;
        this.adsService.changeStatusOfAds(ads, ads.id).subscribe(() => {
          this.notification.success('', 'The ad is deleted');
        });
      },
    });
  }

  soldAd(active: Ads, index: number): void {
    this.modal.confirm({
      nzTitle: 'Whether the ad was actually sold?',
      nzContent: '',
      nzOnOk: () => {
        this.activeProducts[0].splice(index, 1);
        if (this.activeProducts[0].length === 0) {
          this.ads = false;
        }
        const ads = new Ads();
        ads.adsDate = null;
        ads.adsLocation = null;
        ads.adsType = null;
        ads.adsgroupId = null;
        ads.adssubgropuId = null;
        ads.description = null;
        ads.favourite = null;
        ads.fixedPrice = null;
        ads.freeDelivery = null;
        ads.id = active.id;
        ads.image = null;
        ads.price = null;
        ads.productName = null;
        ads.productWarranty = null;
        ads.status = 'SOLD';
        ads.urgentSales = null;
        ads.userId = null;
        this.adsService.changeStatusOfAds(ads, ads.id).subscribe((res) => {
          this.notification.success('', 'The ad is moved to sold');
        });
      },
    });
  }
}
