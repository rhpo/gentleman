<script lang="ts">
  import { onMount } from "svelte";
  import { Chart, registerables } from "chart.js";
  import "chartjs-adapter-date-fns";

  interface Props {
    detailed?: boolean;
    data: Array<{ date: string; value: number }>;
  }

  let { detailed = false, data }: Props = $props();

  let canvas: HTMLCanvasElement;
  let chart: any;

  onMount(() => {
    Chart.register(...registerables);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chartData = data.map((item) => ({
      x: new Date(item.date),
      y: item.value,
    }));

    chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Revenue",
            data: chartData,
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "#10b981",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: detailed ? 2.5 : 2,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 12,
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#10b981",
            borderWidth: 1,
            callbacks: {
              label: (context) =>
                `Revenue: ${context.parsed.y?.toLocaleString() || 0} DZD`,
            },
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "month",
              displayFormats: {
                month: "MMM yyyy",
              },
            },
            grid: {
              display: false,
            },
            ticks: {
              color: "#9ca3af",
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(156, 163, 175, 0.1)",
            },
            ticks: {
              color: "#9ca3af",
              callback: (value) =>
                `${((value as number) / 1000).toFixed(0)}k DZD`,
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
  }
</style>
