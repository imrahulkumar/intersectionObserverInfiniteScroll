import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  intersectionObserver!: IntersectionObserver;
  intersectionObserverForLastCard!: IntersectionObserver;

  ngOnInit(): void {
    this.intersectionObserverIntialize();
    this.callInterSectionObserver();

    this.intersectionObserverIntializeForLastCard();
    this.callInterSectionObserverForLastCard();
  }

  intersectionObserverIntialize(): void {
    /**
     * root =>property identifies the Element or Document whose bounds are treated as the bounding box of the viewport for the element which is the observer's target.
     * threshold => 0.5 if half box is visibe then emit the observer
     */
    const config = {
      root: document.querySelector('.card-container'), // Sets the framing element to the viewport
      rootMargin: '-100px', // if -100px then our container is 100px smaller from bottom and top and it will call that callback method only when it appear in smaller container
      // if +100px then your container is increased from top and bottom by 100px and it will load that content i.e call the callback method
      threshold: 1, // if full appear in dom then call the callback method
    };
    this.intersectionObserver = new IntersectionObserver((observer) => {
      observer.forEach((item) => {
        item.target.classList.toggle('show', item.isIntersecting);
        if (item.isIntersecting) {
          /**
           * For example if you are loading image and after loading you don't need to observe
           * it so in those type of scenario we can use this block
           */
          this.intersectionObserver.unobserve(item.target);
        }
      });
    });
  }

  callInterSectionObserver(): void {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
      this.intersectionObserver.observe(card);
    });
  }

  intersectionObserverIntializeForLastCard(): void {
    this.intersectionObserverForLastCard = new IntersectionObserver(
      (entries) => {
        const lastCard = entries[0];
        if (!lastCard.isIntersecting) return;
        this.loadNewCard();
      },
      {}
    );
  }

  callInterSectionObserverForLastCard(): void {
    const lastCard = document.querySelector('.card:last-child');
    if (lastCard) this.intersectionObserverForLastCard.observe(lastCard);
  }

  loadNewCard(): void {
    const cardContainer = document.querySelector('.card-container');
    for (let i = 0; i < 10; i++) {
      const card = document.createElement('div');
      card.textContent = 'New Card';
      card.classList.add('card');
      this.intersectionObserver.observe(card);
      cardContainer?.append(card);
    }
  }
}
