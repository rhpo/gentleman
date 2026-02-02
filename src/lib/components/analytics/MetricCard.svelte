<script lang="ts">
  import { TrendingUp, TrendingDown } from "@lucide/svelte";
  import type { ComponentType } from "svelte";

  interface Props {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    Icon: any;
    color: string;
  }

  let { title, value, change, trend, Icon, color }: Props = $props();
</script>

<div class="metric-card">
  <div class="metric-header">
    <div class="icon-wrapper" style="background: {color}20;">
      <Icon size={24} {color} />
    </div>
    <div class="trend" class:up={trend === "up"} class:down={trend === "down"}>
      {#if trend === "up"}
        <TrendingUp size={16} />
      {:else}
        <TrendingDown size={16} />
      {/if}
      <span>{change}</span>
    </div>
  </div>
  <div class="metric-content">
    <h4>{title}</h4>
    <p class="value">{value}</p>
  </div>
</div>

<style>
  .metric-card {
    background: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    transition: all var(--transition-fast);
  }

  .metric-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .trend {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .trend.up {
    color: #10b981;
  }

  .trend.down {
    color: #ef4444;
  }

  .metric-content h4 {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xs);
    font-weight: 500;
  }

  .value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
    font-family: var(--font-heading);
  }
</style>
