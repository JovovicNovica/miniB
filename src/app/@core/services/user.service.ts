import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpBaseService } from './http-base.service';
import { User } from '../../shared/models/user.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserFavorite } from '../../shared/models/userFavorite.model';
import { UserAddAdsRequest } from '../../shared/models/useraddAdsRequest.model';
import { Email } from '../../shared/models/email.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = environment.apiUrlBase;

  constructor(private http: HttpBaseService, private httpClient: HttpClient) {}

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(
      `${this.baseUrl}/mybrocki/auth/users/updateuser`,
      user
    );
  }



  deleteUser(id: number): Observable<String> {
    return this.http.delete<String>(`${this.baseUrl}/brocki/users/${id}`);
  }

  getUserById(id: any): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/mybrocki/user/${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/brocki/users`);
  }

  addCredit(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/brocki/users/addcredit`, user);
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/mybrocki/auth/user`);
  }

  removeCredit(user: User): Observable<User> {
    return this.http.put<User>(
      `${this.baseUrl}/brocki/users/removeCredit`,
      user
    );
  }

  updatePassword(user: User): Observable<any> {
    return this.http.put<User>(`${this.baseUrl}/brocki/users/updateuser`, user);
  }

  updateUserFavourites(useraddAdsRequest: UserAddAdsRequest): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/mybrocki/auth/users/favourites`,
      useraddAdsRequest
    );
  }

  getFavourites(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/mybrocki/auth/users/favourites/${id}`
    );
  }

  deleteUserFavourite(adId: number, userId: number) {
    return this.http.delete<UserFavorite>(
      `${this.baseUrl}/mybrocki/auth/users/favourites/delete?adsId=${adId}&userId=${userId}`
    );
  }

  /**
   * send email
   *
   */
  contactUs(email: Email) {
    let params = new HttpParams();
    params = params.append('email', email.email);
    params = params.append('name', email.name);
    params = params.append('subject', email.subject);
    params = params.append('message', email.message);
    return this.httpClient.post<Email>(
      `${this.baseUrl}/mybrocki/contactus`,
      params
    );
  }

  confirmAccount(token: any): Observable<any>  {
    return this.http.post(`${this.baseUrl}/mybrocki/confirm-account?token=${token}`, token);
  }


}
