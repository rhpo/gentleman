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
      type: "bar",
      data: {
        datasets: [
          {
            label: "Orders",
            data: chartData,
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderColor: "#3b82f6",
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: "rgba(59, 130, 246, 1)",
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
            borderColor: "#3b82f6",
            borderWidth: 1,
            callbacks: {
              label: (context) => `Orders: ${context.parsed.y}`,
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
              stepSize: 50,
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
