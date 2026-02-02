<script lang="ts">
  import { onMount } from "svelte";
  import { Chart, registerables } from "chart.js";
  import "chartjs-adapter-date-fns";

  interface Props {
    data: Array<{
      date: string;
      newCustomers: number;
      returningCustomers: number;
    }>;
  }

  let { data }: Props = $props();

  let canvas: HTMLCanvasElement;
  let chart: any;

  onMount(() => {
    Chart.register(...registerables);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newCustomersData = data.map((item) => ({
      x: new Date(item.date),
      y: item.newCustomers,
    }));

    const returningCustomersData = data.map((item) => ({
      x: new Date(item.date),
      y: item.returningCustomers,
    }));

    chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "New Customers",
            data: newCustomersData,
            borderColor: "#8b5cf6",
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "#8b5cf6",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
          },
          {
            label: "Returning Customers",
            data: returningCustomersData,
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
        aspectRatio: 2.5,
        plugins: {
          legend: {
            display: true,
            position: "top",
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
            mode: "index",
            intersect: false,
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
              stepSize: 25,
            },
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
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
