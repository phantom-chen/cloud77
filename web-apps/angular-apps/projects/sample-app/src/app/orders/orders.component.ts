import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { AfterViewInit, Component } from "@angular/core";
import { lastValueFrom, retry } from "rxjs";

@Component({
  selector: "app-orders",
  standalone: true,
  imports: [],
  templateUrl: "./orders.component.html",
  styleUrl: "./orders.component.css",
})
export class OrdersComponent implements AfterViewInit {
  constructor(private http: HttpClient) {}
  ngAfterViewInit(): void {
    this.http
      .get("/api/sample/products")
      .pipe(retry(3))
      .subscribe((data) => {
        console.log(data);
      });
  }

  putProduct(code: number): Promise<HttpResponse<any>> {
    const params: HttpParams = new HttpParams().set("code", code.toString());
    const response = this.http.put(
      `/api/sample/products`,
      { name: "tester" },
      { params, observe: "response" }
    );
    return lastValueFrom(response);
  }

  postProduct(code: number): Promise<HttpResponse<any>> {
    const response = this.http.post(
      `/api/sample/products`,
      { name: "tester" },
      { observe: "response" }
    );
    return lastValueFrom(response);
  }
}
