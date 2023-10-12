<template>
  <div>
    <apexchart
      :key="series"
      height="350"
      width="100%"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>
<script setup lang="ts">
const series = ref([
  {
    name: "RP",
    data: [
      { x: +new Date() - 150, y: 1 },
      { x: new Date(), y: 0.6 },
      { x: +new Date() + 300, y: 0.2 },
      { x: +new Date() + 400, y: 0.13 },
      { x: +new Date() + 500, y: 0.1 },
      { x: +new Date() + 600, y: 0.07 },
      { x: +new Date() + 700, y: 0.05 },
      { x: +new Date() + 800, y: 0.04 },
      { x: +new Date() + 900, y: 0.03 },
      { x: +new Date() + 1000, y: 0.02 },
    ],
  },
]);

const options = ref({
  annotations: {
    xaxis: [
      {
        x: +new Date(),
        strokeDashArray: 5,
        borderColor: "#627EEA",
      },
    ],
    points: [
      {
        x: +new Date(),
        y: 0.6,
        marker: {
          size: 6,
          fillColor: "#627EEA",
        },
        label: {
          borderWidth: 0,
          text: 0.6,
          textAnchor: "right",
          offsetX: 15,
          offsetY: 0,
          style: {
            background: "#627EEA",
            color: "white",
            fontSize: "14px",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
            padding: {
              left: 10,
              right: 10,
              top: 5,
              bottom: 5,
            },
          },
        },
      },
    ],
  },
  chart: {
    type: "line",
    toolbar: {
      show: true,
      tools: {
        download: false,
        selection: false,
        pan: false,
        zoom: false,
        reset: false,
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      colorStops: [
        {
          offset: 20,
          color: "#2B2D2A",
          opacity: 1,
        },
        {
          offset: 55,
          color: "#627EEA",
          opacity: 1,
        },
      ],
    },
  },
  grid: {
    show: false,
  },
  labels: ["0", "Today", "Today", "asd"],
  stroke: {
    curve: "smooth",
    width: 1.5,
  },
  title: {
    text: "RATE PROJECTION",
    align: "left",
    margin: 10,
    offsetX: -10,
    style: {
      fontSize: "12px",
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
      color: "#868886",
      fontWeight: "regular",
    },
  },
  tooltip: {
    x: {
      show: false,
    },
    y: {
      formatter: undefined,
      title: {
        formatter: (seriesName) => "",
      },
    },
    marker: {
      show: false,
    },
    style: {
      fontSize: "12px",
      fontFamily: undefined,
    },
  },
  xaxis: {
    axisBorder: {
      show: true,
      color: "#5E605D",
      height: 1,
      width: "100%",
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: true,
    },
  },
  yaxis: {
    show: false,
    showAlways: false,
    labels: {
      show: false,
    },
  },
});
</script>

<style scoped>
.apexcharts-tooltip {
  background: #f3f3f3;
  color: red;
}
</style>
