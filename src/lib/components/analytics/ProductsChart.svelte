<script lang="ts">
  import { onMount } from "svelte";
  import { Chart, registerables } from "chart.js";

  interface Props {
    data: Array<{ name: string; quantity: number }>;
  }

  let { data }: Props = $props();

  let canvas: HTMLCanvasElement;
  let chart: any;

  onMount(() => {
    Chart.register(...registerables);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const labels = data.map((item) => item.name);
    const values = data.map((item) => item.quantity);

    chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              "#10b981",
              "#3b82f6",
              "#f59e0b",
              "#8b5cf6",
              "#ef4444",
              "#06b6d4",
              "#ec4899",
              "#14b8a6",
            ],
            borderColor: "#1f2937",
            borderWidth: 2,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "#9ca3af",
              padding: 15,
              font: {
                size: 12,
              },
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 12,
            titleColor: "#fff",
            bodyColor: "#fff",
            borderWidth: 1,
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce(
                  (a: number, b: number) => a + b,
                  0,
                );
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} units (${percentage}%)`;
              },
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  });
</script>

<div class="chart-wrapper">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .chart-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 400px;
  }
</style>
