import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DefaultResponse, UserEmail, UserRole, UserToken } from "@phantom-chen/cloud77";
import { HTTP_TIMEOUT_SECOND } from "@shared/constants";
import { Observable, timeout } from "rxjs";

export interface TokenValidationResult extends UserRole {
    expiration: string;
}

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(email: string, name: string): Observable<UserEmail> {
    let params = new HttpParams();
    if (email && email !== "") {
      params = params.set("email", email.toLowerCase());
    }
    if (name && name !== "") {
      params = params.set("username", name.toLowerCase());
    }
    return this.http
      .get<UserEmail>("/api/sso/users", { params })
      .pipe(timeout(HTTP_TIMEOUT_SECOND * 1000));
  }

  createUser(
    email: string,
    name: string,
    password: string,
  ): Observable<DefaultResponse> {
    return this.http
      .post<DefaultResponse>("/api/sso/users", {
        email: email,
        name: name,
        password: password,
      })
      .pipe(timeout(HTTP_TIMEOUT_SECOND * 1000));
  }

  getToken(email: string, password: string): Observable<UserToken> {
    return this.http
      .post<UserToken>(`/api/sso/tokens`, { email, password, name: "" })
      .pipe(timeout(HTTP_TIMEOUT_SECOND * 1000));
  }

  refreshToken(email: string, refreshToken: string): Observable<UserToken> {
    return this.http
      .post<UserToken>(
        `/api/sso/tokens`,
        { email, password: "", name: "" },
        {
          headers: {
            "x-refresh-token": refreshToken,
          },
        },
      )
      .pipe(timeout(HTTP_TIMEOUT_SECOND * 1000));
  }
}