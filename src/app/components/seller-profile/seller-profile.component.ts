import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../@core/services/user.service';
import { AdsService } from '../../@core/services/ads.service';
import { AdsParam } from '../../shared/models/adParams.model';
import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { NzInputNumberComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.scss'],
})
export class SellerProfileComponent implements OnInit {
  active: boolean;
  sold: boolean;
  about: boolean;
  info: boolean;
  guest: boolean;
  email: boolean;
  sellerId;
  seller;
  sellerName: string;
  sellerPhone: string;
  sellerMobile: string;
  sellerEmail: string;
  defaultImage = '../../../assets/images/myAccount/profile-picture.png';
  sellerImage: string = this.defaultImage;
  sellerindex: number;
  activeProducts: Array<any> = [];
  adsActive: boolean;
  soldProducts: Array<any> = [];
  adsSold: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private adsService: AdsService
  ) {}

  ngOnInit() {
    this.active = true;
    this.activatedRoute.params.subscribe((params) => {
      this.sellerId = params['id'];
      this.userService.getUserById(this.sellerId).subscribe((seller) => {
        this.sellerindex = seller.id;
        this.sellerName = seller.userName;
        this.sellerPhone = seller.phone;
        this.sellerMobile = seller.mobile;
        this.sellerEmail = seller.email;
        seller.companyImage[0]
          ? (this.sellerImage = seller.companyImage[0])
          : (this.sellerImage = this.defaultImage);
      });
    });

    this.adsService.getAllByUserId(this.sellerId).subscribe((res) => {
      this.activeProducts.push(res);
      if (this.activeProducts[0].length === 0) {
        this.adsActive = false;
      } else {
        this.adsActive = true;
      }
    });
  }

  activeButton() {
    this.sold = false;
    this.about = false;
    this.info = false;
    this.guest = false;
    this.active = true;
  }

  soldButton() {
    this.about = false;
    this.info = false;
    this.guest = false;
    this.active = false;
    this.sold = true;
    const soldAds = new AdsParam();
    soldAds.status = 'SOLD';
    soldAds.userId = this.sellerindex;
    this.adsService.getSoldAds(soldAds).subscribe((res) => {
      this.soldProducts.push(res);
      if (this.soldProducts[0].length === 0) {
        this.adsSold = false;
      } else {
        this.adsSold = true;
      }
    });
  }

  aboutButton() {
    this.info = false;
    this.guest = false;
    this.active = false;
    this.sold = false;
    this.about = true;
  }

  infoButton() {
    this.guest = false;
    this.active = false;
    this.sold = false;
    this.about = false;
    this.info = true;
  }

  guestButton() {
    this.active = false;
    this.sold = false;
    this.about = false;
    this.info = false;
    this.guest = true;
  }

  toggleEmail(): void {
    this.email = !this.email;
  }
}
