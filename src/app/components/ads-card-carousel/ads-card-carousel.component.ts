import {AfterViewInit, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UserService} from '../../@core/services/user.service';
import {HelpersService} from '../../@core/services/helpers.service';
import {UserAddAdsRequest} from '../../shared/models/useraddAdsRequest.model';
import {Ads} from '../../shared/models/ads.model';
import {AuthConst} from '../../@core/consts/auth.const';
import { Router } from '@angular/router';
import { NgxCarousel } from 'ngx-carousel';



@Component({
  selector: 'app-ads-card-carousel',
  templateUrl: './ads-card-carousel.component.html',
  styleUrls: ['./ads-card-carousel.component.scss']
})
export class AdsCardCarouselComponent implements OnInit, OnChanges,AfterViewInit {

  public carouselTileItems: Array<any>;
  public carouselTile: NgxCarousel;


  public carouselOne: NgxCarousel;
  userRequest: UserAddAdsRequest;
  @Input() userId;
  @Input() randomAds: Ads[];
  @Input() favoriteNumber;
  ads: Ads[];
  numberOfFavorites: number;

  token;

  title = 'ngSlick';


  constructor(private userService: UserService, private helpersService: HelpersService, private router: Router) { }

  ngOnInit() {

    this.token = localStorage.getItem(AuthConst.token);
    this.carouselTile = {
      grid: {xs: 2, sm: 3, md: 3, lg: 3, all: 0},
      slide: 2,
      speed: 400,
      animation: 'lazy',
      point: {
        visible: false
      },
      load: 2,
      touch: true,
      easing: 'ease'
    }
  }


  public carouselTileLoad(evt: any) {

    const len = this.randomAds.length
    if (len <= 30) {
      for (let i = len; i < len + 10; i++) {
        this.carouselTileItems.push(i);
      }
    }

  }

  ngAfterViewInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    this.numberOfFavorites = this.favoriteNumber
    this.preloadImages();
  }

  preloadImages() {
    this.ads = this.randomAds;
    console.log(this.ads, 'carousel ads');
  }

  addToWishlist(adId: number) {
    this.userRequest = {
      adsId: adId,
      userId:  Number(localStorage.getItem(AuthConst.userId)),
    };
    this.userService.updateUserFavourites(this.userRequest).subscribe((x) => {
      console.log('add update to favorite', x);
      this.raiseAdNumber();
    }),
      (error) => {
        console.log('not to favorite');
      };
    this.helpersService.$numOfFavs.next();
  }

  removeFromWishlist(adId: number) {
    this.userService.deleteUserFavourite(adId,  Number(localStorage.getItem(AuthConst.userId))).subscribe((x) => {
      console.log('delete update to favorite', x);
      this.downAdNumber();
    }),
      // tslint:disable-next-line:no-unused-expression
      (error) => {
        console.log('not delete to favorite');
      };
    this.helpersService.$numOfFavs.next();
  }

 goToAd(event, id: number) {
  if(event.button === 0) {
    this.router.navigate(['/ad', id]);
    console.log(event.button)
  }
 }

 onEvent(event) {
  event.stopPropagation();
}

sendNumberOfFavorites(number: number) {
  this.helpersService.sendNumberOfFavorites(number);
}

raiseAdNumber() {
  this.numberOfFavorites = this.numberOfFavorites + 1;
  this.sendNumberOfFavorites(this.numberOfFavorites);
}

downAdNumber() {
  this.numberOfFavorites = this.numberOfFavorites - 1;
  this.sendNumberOfFavorites(this.numberOfFavorites);
}


}


