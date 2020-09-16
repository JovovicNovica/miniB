import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../@core/services/user.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { AuthConst } from '../../@core/consts/auth.const';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  userId: number;
  token;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    (this.token = localStorage.getItem(AuthConst.token)),
      window.scrollTo({ top: 0 });
    this.contactForm = this.fb.group({
      name: [''],
      email: [''],
      subject: [''],
      message: [''],
    });
    if (this.token) {
      this.userService.getUser().subscribe((res) => {
        this.userId = res.id;
      });
    } else {
      return;
    }
  }

  onSubmit() {
    class contacUsEmail {
      name: string;
      email: string;
      subject: string;
      message: string;
    }

    const email = new contacUsEmail();
    email.name = this.contactForm.value.name;
    email.email = this.contactForm.value.email;
    email.subject = this.contactForm.value.subject;
    email.message = this.contactForm.value.message;
    this.notification.success('', 'An email has been sent');
    this.router.navigate([`/user/${this.userId}`]);
    this.userService.contactUs(email).subscribe();
  }
}
