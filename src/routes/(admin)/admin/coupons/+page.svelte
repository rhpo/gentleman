<!-- Admin Coupons Management -->
<script lang="ts">
  import { onMount } from "svelte";
  import {
    listCoupons,
    createNewCoupon,
    updateExistingCoupon,
    deleteExistingCoupon,
  } from "$lib/api/admin/coupons";
  import AdminPage from "$lib/components/AdminPage.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { Trash2, Edit, Plus } from "@lucide/svelte";

  import type { Coupon, CouponInput } from "$lib/types/entities";

  let coupons = $state<Coupon[]>([]);
  let isLoading = $state(true);
  let isModalOpen = $state(false);
  let isSubmitting = $state(false);
  let editingCoupon = $state<Coupon | null>(null);

  let formData = $state<CouponInput>({
    code: "",
    reduction_percent: 0,
    valid_from: new Date().toISOString().split("T")[0],
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    active: true,
  });

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

  function openCreateModal() {
    editingCoupon = null;
    formData = {
      code: "",
      reduction_percent: 0,
      valid_from: new Date().toISOString().split("T")[0],
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      active: true,
    };
    isModalOpen = true;
  }

  function openEditModal(coupon: Coupon) {
    editingCoupon = coupon;
    formData = {
      code: coupon.code,
      reduction_percent: coupon.reduction_percent,
      valid_from: coupon.valid_from.split("T")[0],
      valid_until: coupon.valid_until.split("T")[0],
      active: coupon.active,
    };
    isModalOpen = true;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    try {
      isSubmitting = true;
      if (editingCoupon) {
        await updateExistingCoupon(editingCoupon.id, formData);
      } else {
        await createNewCoupon(formData);
      }
      await loadCoupons();
      isModalOpen = false;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save coupon");
    } finally {
      isSubmitting = false;
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteExistingCoupon(id);
      await loadCoupons();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete coupon");
    }
  }
</script>

<AdminPage title="Manage Coupons" description="Manage your discount coupons">
  {#snippet actions()}
    <Button type="primary" onclick={openCreateModal} Icon={Plus}
      >Create Coupon</Button
    >
  {/snippet}

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
            <th>Reduction (%)</th>
            <th>Valid From</th>
            <th>Valid Until</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each coupons as coupon}
            <tr>
              <td><strong>{coupon.code}</strong></td>
              <td>{coupon.reduction_percent}%</td>
              <td>{new Date(coupon.valid_from).toLocaleDateString()}</td>
              <td>{new Date(coupon.valid_until).toLocaleDateString()}</td>
              <td>
                <span class="status-badge" class:active={coupon.active}>
                  {coupon.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button
                    class="action-btn edit"
                    onclick={() => openEditModal(coupon)}
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    class="action-btn delete"
                    onclick={() => handleDelete(coupon.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</AdminPage>

<Modal
  bind:isOpen={isModalOpen}
  title={editingCoupon ? "Edit Coupon" : "Create Coupon"}
  onClose={() => (isModalOpen = false)}
>
  <form onsubmit={handleSubmit} class="coupon-form">
    <Input
      label="Coupon Code"
      id="code"
      bind:value={formData.code}
      placeholder="e.g. SUMMER25"
      required
    />

    <Input
      label="Reduction Percent"
      id="reduction"
      type="number"
      bind:value={formData.reduction_percent}
      min="0"
      max="100"
      required
    />

    <div class="form-row">
      <Input
        label="Valid From"
        id="valid_from"
        type="date"
        bind:value={formData.valid_from}
        required
      />
      <Input
        label="Valid Until"
        id="valid_until"
        type="date"
        bind:value={formData.valid_until}
        required
      />
    </div>

    <div class="checkbox-group">
      <input
        type="checkbox"
        id="active"
        bind:checked={formData.active}
        class="custom-checkbox"
      />
      <label for="active">Active</label>
    </div>

    <div class="form-actions">
      <Button type="secondary" onclick={() => (isModalOpen = false)}
        >Cancel</Button
      >
      <Button type="primary" isSubmit disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : editingCoupon ? "Update" : "Create"}
      </Button>
    </div>
  </form>
</Modal>

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
    font-size: 1.5rem;
    margin: 0;
  }

  .loading,
  .empty-state {
    padding: var(--spacing-xl);
    text-align: center;
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
  }

  .coupons-table {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background-color: var(--color-black);
    color: var(--color-white);
  }

  th,
  td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--color-border);
  }

  th {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 0.75rem;
    font-weight: 600;
  }

  tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  .status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    background-color: #eee;
    color: #666;
  }

  .status-badge.active {
    background-color: #e6fcf5;
    color: #0ca678;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-btn.edit {
    color: #228be6;
  }
  .action-btn.edit:hover {
    background-color: #e7f5ff;
  }

  .action-btn.delete {
    color: #fa5252;
  }
  .action-btn.delete:hover {
    background-color: #fff5f5;
  }

  /* Form Styles */
  .coupon-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-width: 400px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .custom-checkbox {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
  }

  @media (max-width: 768px) {
    .coupon-form {
      min-width: 100%;
    }
    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
