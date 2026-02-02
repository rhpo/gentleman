<script lang="ts">
  import AdminPage from "$lib/components/AdminPage.svelte";
  import Container from "$lib/components/ui/Container.svelte";
  import RevenueChart from "$lib/components/analytics/RevenueChart.svelte";
  import OrdersChart from "$lib/components/analytics/OrdersChart.svelte";
  import ProductsChart from "$lib/components/analytics/ProductsChart.svelte";
  import CustomersChart from "$lib/components/analytics/CustomersChart.svelte";
  import MetricCard from "$lib/components/analytics/MetricCard.svelte";
  import { DollarSign, ShoppingCart, Package, Users } from "@lucide/svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let activeTab = $state<
    "overview" | "revenue" | "orders" | "products" | "customers"
  >("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "revenue", label: "Revenue" },
    { id: "orders", label: "Orders" },
    { id: "products", label: "Products" },
    { id: "customers", label: "Customers" },
  ] as const;

  const metrics = $derived(
    data.analytics
      ? [
          {
            title: "Total Revenue",
            value: `$${Number(data.analytics.metrics.totalRevenue).toLocaleString()}`,
            change: data.analytics.metrics.revenueChange,
            trend: data.analytics.metrics.revenueTrend as "up" | "down",
            Icon: DollarSign,
            color: "#10b981",
          },
          {
            title: "Total Orders",
            value: data.analytics.metrics.totalOrders.toLocaleString(),
            change: data.analytics.metrics.ordersChange,
            trend: data.analytics.metrics.ordersTrend as "up" | "down",
            Icon: ShoppingCart,
            color: "#3b82f6",
          },
          {
            title: "Products Sold",
            value: data.analytics.metrics.totalProductsSold.toLocaleString(),
            change: "+0.0%",
            trend: "up" as const,
            Icon: Package,
            color: "#f59e0b",
          },
          {
            title: "Active Customers",
            value: data.analytics.metrics.uniqueCustomers.toLocaleString(),
            change: "+0.0%",
            trend: "up" as const,
            Icon: Users,
            color: "#8b5cf6",
          },
        ]
      : [],
  );
</script>

<AdminPage title="Analytics" description="Track your store performance">
  <div class="tabs">
    {#each tabs as tab}
      <button
        class="tab"
        class:active={activeTab === tab.id}
        onclick={() => (activeTab = tab.id)}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <Container>
    {#if data.analytics}
      {#if activeTab === "overview"}
        <div class="metrics-grid">
          {#each metrics as metric}
            <MetricCard {...metric} />
          {/each}
        </div>

        <div class="charts-grid">
          <div class="chart-container">
            <h3>Revenue Overview</h3>
            <RevenueChart data={data.analytics.revenueByMonth} />
          </div>
          <div class="chart-container">
            <h3>Orders Trend</h3>
            <OrdersChart data={data.analytics.ordersByMonth} />
          </div>
        </div>
      {:else if activeTab === "revenue"}
        <div class="chart-full">
          <h3>Revenue Analytics</h3>
          <RevenueChart data={data.analytics.revenueByMonth} detailed={true} />
        </div>
      {:else if activeTab === "orders"}
        <div class="chart-full">
          <h3>Orders Analytics</h3>
          <OrdersChart data={data.analytics.ordersByMonth} detailed={true} />
        </div>
      {:else if activeTab === "products"}
        <div class="chart-full">
          <h3>Products Performance</h3>
          <ProductsChart data={data.analytics.topProducts} />
        </div>
      {:else if activeTab === "customers"}
        <div class="chart-full">
          <h3>Customer Analytics</h3>
          <CustomersChart data={data.analytics.customersByMonth} />
        </div>
      {/if}
    {:else}
      <div class="error">
        <p>Failed to load analytics data</p>
      </div>
    {/if}
  </Container>
</AdminPage>

<style>
  .tabs {
    display: flex;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-lg);
    border-bottom: 2px solid var(--color-border);
    overflow-x: auto;
  }

  .tab {
    padding: var(--spacing-md) var(--spacing-lg);
    background: none;
    border: none;
    color: var(--color-text-secondary);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    border-bottom: 3px solid transparent;
    white-space: nowrap;
  }

  .tab:hover {
    color: var(--color-text);
    background: var(--color-card-bg);
  }

  .tab.active {
    color: var(--color-accent);
    border-bottom-color: var(--color-accent);
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }

  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: var(--spacing-lg);
  }

  .chart-container,
  .chart-full {
    background: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
  }

  .chart-container h3,
  .chart-full h3 {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
  }

  @media (max-width: 768px) {
    .charts-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
