<template>
  <div>
    <apexchart
      :key="series"
      :height="height || 350"
      width="100%"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>
<script setup lang="ts">
import { formatEther } from "viem";

const { currentCost, getPricePoints } = useAuction();

const series = ref([
  {
    name: "RP",
    data: getPricePoints(),
  },
]);

const props = defineProps<{
  showOptions?: boolean;
  height?: number;
}>();

const options = computed(() => {
  return {
    annotations: {
      xaxis: [
        {
          show: props.showOptions,
          x: currentCost.value.timestamp,
          strokeDashArray: 4,
          borderColor: "#627EEA",
        },
      ],
      points: [
        {
          show: props.showOptions,
          x: currentCost.value.timestamp,
          y: Number(currentCost?.value.value),
          marker: {
            size: 6,
            fillColor: "#627EEA",
          },
          label: {
            borderWidth: 0,
            text: formatNumber(formatEther(currentCost.value.value || 0n)),
            offsetX: 20,
            offsetY: -15,
            style: {
              background: "#627EEA",
              color: "white",
              fontSize: "14px",
              fontFamily:
                "Inter, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
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
          show: props.showOptions,
          x: currentCost.value.timestamp,
          y: Number(currentCost.value.value),
          marker: {
            size: 6,
            fillColor: "#627EEA",
          },
          label: {
            borderWidth: 0,
            text: "NOW",
            textAnchor: "bottom",
            offsetX: -11,
            offsetY: 50,
            style: {
              background: "transparent",
              fontSize: "10px",
              color: "#728DA5",
              fontFamily:
                "Inter, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
            },
          },
        },
      ],
    },
    chart: {
      type: "line",
      toolbar: {
        show: props.showOptions,
        tools: {
          download: false,
          selection: false,
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
    labels: ["0", "Today"],
    stroke: {
      width: 2,
    },
    theme: {
      mode: "light",
    },
    tooltip: {
      y: {
        show: props.showOptions,
      },
      x: {
        show: false,
      },

      marker: {
        show: false,
      },

      custom: function ({ series, seriesIndex, dataPointIndex }) {
        return (
          "<div class='bg-[#627EEA] font-inter px-2 py-1'>" +
          "<span>" +
          formatNumber(
            formatEther(BigInt(series[seriesIndex][dataPointIndex]))
          ) +
          "</span>" +
          "</div>"
        );
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
        show: props.showOptions,
      },
    },
    yaxis: {
      show: false,
      showAlways: false,
      labels: {
        show: false,
      },
    },
  };
});
</script>

<style>
.apexcharts-tooltip {
  box-shadow: none !important;
  border: none !important;
  font-family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace";
}
</style>
