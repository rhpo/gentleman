<!-- Footer Component -->
<script lang="ts">
  import { t } from "$lib/i18n/translations";
  import { brands } from "$lib/i18n/brand";
</script>

<footer>
  <div class="footer-container">
    <div class="footer-section">
      <h3 class="brand">{$brands.name}</h3>
      <p class="slogan">{$brands.slogan}</p>
    </div>

    <div class="footer-section">
      <h4>{$t.categories}</h4>
      <ul>
        <li><a href="/products?type=parfum">{$t.parfum}</a></li>
        <li><a href="/products?type=montre">{$t.montre}</a></li>
        <li><a href="/products?type=lunettes">{$t.lunettes}</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h4>{$t.contact}</h4>
      <p>{$brands.location}</p>
      <p><a href="mailto:{$brands.email}">{$brands.email}</a></p>
    </div>
  </div>

  <div class="footer-bottom">
    <p>
      &copy; {new Date().getFullYear()}
      {$brands.name}. {$t.allRightsReserved}
    </p>
  </div>
</footer>

<style>
  footer {
    background-color: var(--color-accent);
    color: var(--color-bg);
    padding: var(--spacing-xl) 0 var(--spacing-md);
    margin-top: var(--spacing-xl);
  }

  .footer-container {
    max-width: var(--view-width);
    margin: 0 auto;
    padding: 0 var(--spacing-md);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
  }

  .footer-section h3,
  .footer-section h4 {
    margin-bottom: var(--spacing-sm);
    text-transform: uppercase;
    font-family: var(--font-body);
    letter-spacing: 0.2em;

    font-weight: 300;
  }

  :global([dir="rtl"]) .footer-section h3,
  :global([dir="rtl"]) .footer-section h4 {
    letter-spacing: 0;
  }

  .brand {
    font-family: var(--font-brand) !important;
    font-size: 2rem;
  }

  .slogan {
    font-style: italic;
    opacity: 0.8;
  }

  .footer-section ul {
    list-style: none;
    padding: 0;
  }

  .footer-section li {
    margin-bottom: 0.5rem;
  }

  .footer-section a {
    color: var(--color-bg);
    text-decoration: none;
    transition: opacity var(--transition-fast);
  }

  .footer-section a:hover {
    opacity: 0.7;
  }

  .footer-bottom {
    text-align: center;
    margin-top: var(--spacing-lg);
    padding-top: var(--spacing-md);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 0.875rem;
    opacity: 0.8;
  }

  [data-theme="dark"] footer {
    background-color: var(--color-bg);
    color: var(--color-text);
    border-top: 1px solid var(--color-border);
  }

  [data-theme="dark"] .footer-section a {
    color: var(--color-text);
  }

  [data-theme="dark"] .footer-bottom {
    border-top: 1px solid var(--color-border);
  }
</style>
