import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.initCursor();
    this.initReveal();
    this.initSkillBars();
    this.initCountUp();
  }

  private initCursor(): void {
    const cursor = document.getElementById('cursor') as HTMLElement | null;
    const ring = document.getElementById('cursorRing') as HTMLElement | null;
    if (!cursor || !ring) {
      return;
    }

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;

    document.addEventListener('mousemove', (event) => {
      mx = event.clientX;
      my = event.clientY;
      cursor.style.left = `${mx - 5}px`;
      cursor.style.top = `${my - 5}px`;
    });

    const animateRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = `${rx - 19}px`;
      ring.style.top = `${ry - 19}px`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document
      .querySelectorAll<HTMLElement>('a,button,.proj-card,.form-card,.contact-item')
      .forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursor.style.transform = 'scale(2.5)';
          ring.style.transform = 'scale(1.5)';
          ring.style.opacity = '0.8';
        });
        el.addEventListener('mouseleave', () => {
          cursor.style.transform = 'scale(1)';
          ring.style.transform = 'scale(1)';
          ring.style.opacity = '0.5';
        });
      });
  }

  private initReveal(): void {
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (reveals.length === 0) {
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    reveals.forEach((el) => obs.observe(el));
  }

  private initSkillBars(): void {
    const groups = Array.from(document.querySelectorAll<HTMLElement>('.skill-group'));
    if (groups.length === 0) {
      return;
    }

    const skillObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          (entry.target as HTMLElement)
            .querySelectorAll<HTMLElement>('.skill-bar')
            .forEach((bar) => {
              const width = bar.dataset['width'];
              if (width) {
                bar.style.width = `${width}%`;
              }
            });
        });
      },
      { threshold: 0.3 }
    );

    groups.forEach((group) => skillObs.observe(group));
  }

  private initCountUp(): void {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.stat-item'));
    if (items.length === 0) {
      return;
    }

    const countObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const el = entry.target.querySelector<HTMLElement>('[data-count]');
          if (!el) {
            return;
          }
          const countEl = el as HTMLElement & { animated?: boolean };
          if (countEl.animated) {
            return;
          }
          countEl.animated = true;
          const target = Number(countEl.dataset['count'] ?? 0);
          let current = 0;
          const step = () => {
            current += Math.ceil(target / 30);
            if (current >= target) {
              countEl.textContent = String(target);
              return;
            }
            countEl.textContent = String(current);
            requestAnimationFrame(step);
          };
          step();
        });
      },
      { threshold: 0.5 }
    );

    items.forEach((item) => countObs.observe(item));
  }
}
