import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ads } from 'app/shared/models/ads.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../@core/services/user.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthConst } from '../../@core/consts/auth.const';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit {
  emailForm: FormGroup;
  @Output() readonly closeEmail = new EventEmitter<void>();
  @Input() sellerEmail: string;
  @Input() adForEmail: Ads;

  toSender: boolean = false;
  language: string;
  adLink: string;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.adLink = document.URL;
    this.emailForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ],
      ],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/)]],
      message: ['', [Validators.required]],
    });

    this.language = localStorage.getItem(AuthConst.language);
  }

  closeModal(): void {
    this.closeEmail.emit();
  }

  copyOfEmail(): void {
    this.toSender = !this.toSender;
  }

  emptyFields() {
    if (this.language === 'en') {
      return this.toastr.warning('Please fill in all fields');
    } else if (this.language === 'fr') {
      return this.toastr.warning('Merci de remplir tous les champs');
    } else if (this.language === 'de') {
      return this.toastr.warning('Bitte füllen Sie alle Felder aus');
    } else if (this.language === 'it') {
      return this.toastr.warning('Si prega di compilare tutti i campi');
    }
  }

  onSubmit() {

    class sendEmail {
      name: string;
      email: string;
      emailSeller: string;
      phone: string;
      message: string;
      toSender: boolean;
      adlink: string;
      ad?: Ads;
    }

    const email = new sendEmail();

    if (this.emailForm.invalid) {
      this.toastr.warning(
        this.translateService.instant('translate.fillEveryFieldError')
      );
      return;
    }

    if (this.adForEmail) {
      email.ad = this.adForEmail;
      email.adlink = this.adLink;
    }
    email.name = this.emailForm.value.name;
    email.email = this.emailForm.value.email;
    email.emailSeller = this.sellerEmail;
    email.phone = this.emailForm.value.phone;
    email.message = this.emailForm.value.message;
    email.toSender = this.toSender;

    this.userService.sendEmailToSeller(email).subscribe( x => {
      if (x) {
        this.toastr.success(this.translateService.instant('translate.emailSent'));
        this.router.navigate([`/site`]);
      }
      // tslint:disable-next-line: no-unused-expression
      (error) => {
      this.router.navigate([`/ad/${this.adForEmail.id}`]);
      this.toastr.error(
          this.translateService.instant('translate.wentWrong')
        );
      };
    });
  }
}
