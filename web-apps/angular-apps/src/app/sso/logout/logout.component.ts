import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { removeTokens } from "@shared/storages";

@Component({
  selector: "app-logout",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./logout.component.html",
  styleUrl: "./logout.component.css",
})
export class LogoutComponent implements OnInit, AfterViewInit {
  ngOnInit(): void {
    this.channel.onmessage = (event) => {
      console.log("Received message:", event.data);
      // Handle the received message here
    };
    console.log("logout");
    removeTokens('session');
    console.log("go to login page");
    console.log("read related sites from storage");
    console.log("verify logout code / token");
  }

  channel: BroadcastChannel = new BroadcastChannel("testing");

  constructor(
    private route: ActivatedRoute
  ) {
    const code = this.route.snapshot.queryParamMap.get("code") || "";
    if (code) {
      console.log("token code is " + code);
    }
  }

  ngAfterViewInit(): void {
    this.sites.forEach((app) => {
      console.log(app);
      const ele = document.createElement("iframe");
      ele.src = `${app}/message`;
      ele.hidden = false;
      ele.style.width = "100%";
      ele.style.height = "300px";
      // this.container.nativeElement.append(ele);
    });
  }

  sites = [];

  // @ViewChild('container')
  // container!: ElementRef<HTMLDivElement>;

  // post message to related sites
  handleLogout(): void {
    document.querySelectorAll("iframe").forEach((i) => {
      i.contentWindow?.postMessage({ name: "logout" }, "*");
    });
  }
}
