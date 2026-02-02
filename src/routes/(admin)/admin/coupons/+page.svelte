<!-- Admin Coupons Management -->
<script lang="ts">
  import { onMount } from "svelte";
  import { listCoupons } from "$lib/api/admin/coupons";
  import AdminPage from "$lib/components/AdminPage.svelte";
  import Button from "$lib/components/ui/Button.svelte";

  import type { Coupon } from "$lib/types/entities";

  let coupons = $state<Coupon[]>([]);
  let isLoading = $state(true);

  onMount(async () => {
    await loadCoupons();
  });

  async function loadCoupons(): Promise<void> {
    try {
      isLoading = true;
      coupons = await listCoupons();
    } catch (err) {
      console.error("Error loading coupons:", err);
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Manage Coupons - Admin</title>
</svelte:head>

<AdminPage title="Manage Coupons" description="Manage your discount coupons">
  <div class="admin-section">
    <div class="section-header">
      <h1>Manage Coupons</h1>
      <Button type="primary">Create Coupon</Button>
    </div>

    {#if isLoading}
      <div class="loading">Loading coupons...</div>
    {:else if coupons.length === 0}
      <div class="empty-state">
        <p>No coupons found.</p>
      </div>
    {:else}
      <div class="coupons-table">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Min Amount</th>
              <th>Expires At</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {#each coupons as coupon}
              <tr>
                <td>{coupon.code}</td>
                <td>{coupon.type}</td>
                <td
                  >{coupon.value}{coupon.type === "percentage" ? "%" : "DA"}</td
                >
                <td>{coupon.min_amount ? `${coupon.min_amount} DA` : "-"}</td>
                <td
                  >{coupon.expires_at
                    ? new Date(coupon.expires_at).toLocaleDateString()
                    : "-"}</td
                >
                <td>{coupon.active ? "Yes" : "No"}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</AdminPage>

<style>
  .admin-section {
    padding: var(--spacing-md);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
  }

  .section-header h1 {
    font-family: var(--font-heading);
    letter-spacing: 0.2em;
  }

  .loading,
  .empty-state {
    padding: var(--spacing-lg);
    text-align: center;
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
  }

  .coupons-table {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background-color: var(--color-accent);
    color: var(--color-bg);
  }

  th,
  td {
    padding: var(--spacing-sm);
    text-align: left;
    border-bottom: 1px solid var(--color-border);
  }

  th {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 0.875rem;
  }

  tbody tr:hover {
    background-color: var(--color-border);
  }
</style>
