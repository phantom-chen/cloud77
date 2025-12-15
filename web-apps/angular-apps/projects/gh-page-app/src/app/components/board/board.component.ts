import { CommonModule } from '@angular/common';
import { Component, ComponentFactoryResolver, Input, OnDestroy, OnInit, Type, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularUIModule, BoardContainerDirective } from 'my-angular-ui';

export interface BoardItemComponent {
  data?: JobAd | HeroProfile
}

export interface HeroProfile {
  name: string,
  bio: string
}

export interface JobAd {
  headline: string,
  body: string
}

@Component({
  template: `
    <div class="hero-profile">
      <h3>Featured Hero Profile</h3>
      <h4>{{data.name}}</h4>
      <p>{{data.bio}}</p>
      <strong>Hire this hero today!</strong>
    </div>
  `
})
export class HeroProfileComponent implements BoardItemComponent {
  @Input() data!: HeroProfile;
}

@Component({
  template: `
  <div class="job-ad">
    <h4>{{ data.headline }}</h4>
    {{ data.body }}
  </div>
  `
})
export class JobAdComponent implements BoardItemComponent {
  @Input() data!: JobAd;
}

export class BoardItem {
  constructor(public component: Type<HeroProfileComponent | JobAdComponent>, public data: HeroProfile | JobAd) {}
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AngularUIModule
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit, OnDestroy {
  
  @ViewChild(BoardContainerDirective, { static: true }) container!: BoardContainerDirective;

  items!: BoardItem[];

  itemIndex = 0;

  interval?: any;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.items = [
      new BoardItem(HeroProfileComponent, {name: 'Bombasto', bio: 'Brave as they come'}),
      new BoardItem(HeroProfileComponent, {name: 'Dr IQ', bio: 'Smart as they come'}),
      new BoardItem(JobAdComponent,   {headline: 'Hiring for several positions', body: 'Submit your resume today!'}),
      new BoardItem(JobAdComponent,   {headline: 'Openings in all departments', body: 'Apply today'}),
    ];
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      const item = this.items[Math.floor(Math.random() * this.items.length)];
      console.log(item);
      this.tick();
    }, 3000)
  }

  tick() {
    this.itemIndex = (this.itemIndex + 1) % this.items.length;
    const item = this.items[this.itemIndex];
    const compFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);
    this.container.container.clear();
    const compRef = this.container.container.createComponent<BoardItemComponent>(compFactory);
    compRef.instance.data = item.data;
  }
}
