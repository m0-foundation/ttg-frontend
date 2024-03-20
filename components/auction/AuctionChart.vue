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

const seriesMiddleItemTimestamp =
  series.value[0].data[Math.floor(series.value[0].data.length / 2)].x;

const isEpochFirstHalf = computed(
  () => seriesMiddleItemTimestamp > currentCost.value.timestamp,
);

const props = defineProps<{
  showOptions?: boolean;
  height?: number;
}>();

const annotations = computed(() => {
  if (!props.showOptions)
    return {
      xaxis: [
        {
          x: currentCost.value.timestamp,
          strokeDashArray: 4,
          borderColor: "#627EEA",
        },
      ],
    };

  return {
    xaxis: [
      {
        x: currentCost.value.timestamp,
        strokeDashArray: 4,
        borderColor: "#627EEA",
      },
    ],
    points: [
      {
        x: currentCost.value.timestamp,
        y: Number(currentCost?.value.value),
        marker: {
          size: 6,
          fillColor: "#627EEA",
        },
        label: {
          borderWidth: 0,
          text: formatNumber(formatEther(currentCost.value.value || 0n)),
          textAnchor: isEpochFirstHalf.value ? "start" : "end",
          style: {
            background: "#627EEA",
            color: "white",
            fontSize: "14px",
            fontFamily: "Inter, ui-monospace, SFMono-Regular, monospace",
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
          offsetY: 35,
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
  };
});

const options = computed(() => {
  return {
    annotations: annotations.value,
    chart: {
      type: "line",
      toolbar: {
        show: props.showOptions,
        tools: {
          download: false,
          selection: false,
        },
      },
      background: "transparent",
      parentHeightOffset: 0,
      sparkline: {
        enabled: !props.showOptions,
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
    stroke: {
      width: 2,
    },
    theme: {
      mode: "dark",
    },
    tooltip: {
      enabled: props.showOptions,
      y: {
        show: props.showOptions,
      },

      custom: function ({ series, seriesIndex, dataPointIndex }) {
        return (
          "<div class='bg-grey-900 font-inter px-2 py-1'>" +
          "<span>" +
          formatNumber(
            formatEther(BigInt(series[seriesIndex][dataPointIndex])),
          ) +
          "</span>" +
          "</div>"
        );
      },
    },
    xaxis: {
      axisBorder: {
        show: props.showOptions,
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
        show: false,
        formatter: function (value: number) {
          return `${useDate(value).toFormat("dd DD - HH:mm")}`;
        },
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
}
</style>
