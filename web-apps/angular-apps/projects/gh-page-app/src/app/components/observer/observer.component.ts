import { Component, OnInit } from "@angular/core";
import {
  catchError,
  delay,
  from,
  fromEvent,
  generate,
  interval,
  map,
  mapTo,
  merge,
  mergeAll,
  mergeMap,
  of,
  startWith,
  take,
  takeUntil,
  tap,
  timer,
} from "rxjs";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-observer",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./observer.component.html",
  styleUrl: "./observer.component.css",
})
export class ObserverComponent implements OnInit {
  logs: string = "...";

  ngOnInit(): void {
    const btn = document.querySelector("#btn");
    if (btn) {
      fromEvent<MouseEvent>(btn, "click")
        .pipe(
          map(() => "Found me"),
          startWith("click me")
        )
        .subscribe((x) => (btn.innerHTML = x));
    }

    fromEvent(document, "click")
      .pipe(mapTo("Hi"))
      .subscribe((x) => console.log(x));
    const keydown$ = fromEvent<KeyboardEvent>(document, "keydown");
    const keyup$ = fromEvent<KeyboardEvent>(document, "keyup");

    keydown$
      .pipe(mergeMap((event) => of(event).pipe(delay(2000), takeUntil(keyup$))))
      .subscribe((event) => {
        console.log("long press!", event);
      });
  }

  private appendLog(log: string): void {
    if (this.logs.length == 0) {
      this.logs += log;
    } else {
      this.logs += "\n" + log;
    }
  }

  fromEventClick(): void {
    const keyup$ = fromEvent<KeyboardEvent>(document, "keyup");
    of({ user: "user" })
      .pipe(delay(3000), takeUntil(keyup$))
      .subscribe((user) => {
        console.log(user);
      });
  }

  fromObjectClick(): void {
    from([1, 2, 3, 4, 5]).subscribe((x) => console.log(x));

    from(new Promise<string>((resolve) => resolve("hello world"))).subscribe(
      (x) => console.log(x)
    );

    const map = new Map<string, string>();
    map.set("1", "hi");
    map.set("2", "bye");
    from(map).subscribe((x) => console.log(x));
  }

  ofOperatorClick(): void {
    of({ user: "hello" })
      .pipe(
        tap((data) => {
          this.appendLog(`use tap, get user ${data.user}`);
        })
      )
      .subscribe({
        next: (data) => {
          this.appendLog(`subscribe, get user ${data.user}`);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.appendLog("end of subscribe.");
        },
      });

    of(null)
      .pipe(
        mapTo("hello"),
        delay(4000),
        tap((x) => console.log(x))
      )
      .subscribe((x) => {
        console.log(x);
      });

    const example = of("todo");

    const message = merge(
      example.pipe(mapTo("hello")),
      example.pipe(mapTo("world"), delay(1000)),
      example.pipe(mapTo("good bye"), delay(9000)),
      example.pipe(mapTo("world"), delay(10000))
    );

    message.subscribe((x) => console.log(x));

    of(1, 2, 3)
      .pipe(
        map(
          (x) =>
            new Promise((resolve) =>
              setTimeout(() => {
                resolve(`Result: ${x}`);
              }, x * 1000)
            )
        ),
        mergeAll()
      )
      .subscribe((x) => console.log(x));

    of({ user: "hello" }).subscribe((a) => console.log(a));

    of(1, 2, 3, 4, 5)
      .pipe(
        tap((i) => {
          console.log(i);
        }),
        map((i) => {
          if (i === 4) {
            throw new Error("bad number");
          } else {
            return i;
          }
        }),
        catchError((err) => {
          console.error(err.message);
          return of(-1);
        })
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  generateOperatorClick(): void {
    generate(
      2,
      (x) => x <= 8,
      (x) => x + 3,
      (x) => "$".repeat(x)
    ).subscribe((x) => console.log(x));
  }

  intervalOperatorClick(): void {
    interval(2000)
      .pipe(take(5))
      .subscribe((x) => console.log(`${x * 2}s`));
  }

  timerOperatorClick(): void {
    timer(3500).subscribe((x) => console.log(x));
  }
}
