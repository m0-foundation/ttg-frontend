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
    data: getPricePoints(),
  },
]);

const options = ref({
  annotations: {
    xaxis: [
      {
        x: +new Date(),
        strokeDashArray: 4,
        borderColor: "#627EEA",
      },
    ],

    points: [
      {
        x: +new Date(),
        y: 256,
        marker: {
          size: 6,
          fillColor: "#627EEA",
        },
        label: {
          borderWidth: 0,
          text: 0.6,
          textAnchor: "right",
          offsetX: 20,
          offsetY: -15,
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
      {
        x: +new Date(),
        y: 0,
        marker: {
          size: 6,
          fillColor: "#627EEA",
        },
        label: {
          borderWidth: 0,
          text: "TODAY",
          textAnchor: "bottom",
          offsetX: 0,
          offsetY: 50,
          style: {
            background: "transparent",
            color: "#868886",
            fontSize: "12px",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
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
        zoom: false,
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
    width: 2,
  },
  theme: {
    mode: "light",
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

    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      return (
        '<div class="bg-gray-600 px-2 py-1">' +
        "<span>" +
        series[seriesIndex][dataPointIndex] +
        "</span>" +
        "</div>"
      );
    },
    style: {
      fontSize: "12px",
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
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

<style>
.apexcharts-tooltip {
  box-shadow: none !important;
  border: none !important;
  font-family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace";
}
</style>
