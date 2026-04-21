import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-inner">
        <span class="footer-brand">✦ Wanderlust</span>
        <span class="footer-copy">© {{ year }} Wanderlust · Built with Angular & Express</span>
        <div class="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      border-top: 1px solid #f0ede8; background: #faf9f7;
      padding: 1.25rem 2rem; font-family: 'DM Sans', sans-serif;
    }
    .footer-inner {
      max-width: 1200px; margin: 0 auto;
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 10px;
    }
    .footer-brand { font-family: 'Playfair Display', serif; font-weight: 700; color: #e85d24; font-size: 1rem; }
    .footer-copy { font-size: 0.8rem; color: #999; }
    .footer-links { display: flex; gap: 1rem; }
    .footer-links a { font-size: 0.8rem; color: #999; text-decoration: none; }
    .footer-links a:hover { color: #e85d24; }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
