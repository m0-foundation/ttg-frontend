<template>
  <div ref="table"></div>
</template>

<script setup lang="ts">
import { Grid, Config } from "gridjs";

export interface MTableProps {
  config: Partial<Config>;
}

const props = defineProps<MTableProps>();

const table = ref();

const grid = new Grid(props.config);

onMounted(() => {
  grid.render(table.value);
});
</script>

<style>
.gridjs-head button,
.gridjs-footer button {
  cursor: pointer;
  background-color: transparent;
  background-image: none;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
}

.gridjs-temp {
  position: relative;
}

.gridjs-head {
  width: 100%;
  margin-bottom: 5px;
  padding: 5px 1px;
}
.gridjs-head::after {
  content: "";
  display: block;
  clear: both;
}
.gridjs-head:empty {
  padding: 0;
  border: none;
}

.gridjs-container {
  overflow: hidden;
  display: inline-block;
  padding: 2px;
  color: #fff;
  position: relative;
  z-index: 0;
}

.gridjs-footer {
  display: block;
  position: relative;
  width: 100%;
  z-index: 5;
  padding: 12px 24px;
  border-top: 1px solid #e5e7eb;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.26);
  border-bottom-width: 1px;
  border-color: #e5e7eb;
}
.gridjs-footer:empty {
  padding: 0;
  border: none;
}

input.gridjs-input {
  outline: none;
  background-color: none;
  border: 1px solid #d2d6dc;
  padding: 10px 13px;
  font-size: 14px;
  line-height: 1.45;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
input.gridjs-input:focus {
  box-shadow: 0 0 0 3px rgba(149, 189, 243, 0.5);
  border-color: #9bc2f7;
}

.gridjs-pagination {
  color: #3d4044;
}
.gridjs-pagination::after {
  content: "";
  display: block;
  clear: both;
}
.gridjs-pagination .gridjs-summary {
  float: left;
  margin-top: 5px;
}
.gridjs-pagination .gridjs-pages {
  float: right;
}
.gridjs-pagination .gridjs-pages button {
  padding: 5px 14px;
  border: 1px solid #d2d6dc;
  background-color: #fff;
  border-right: none;
  outline: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
.gridjs-pagination .gridjs-pages button:focus {
  box-shadow: 0 0 0 2px rgba(149, 189, 243, 0.5);
  position: relative;
  margin-right: -1px;
  border-right: 1px solid #d2d6dc;
}
.gridjs-pagination .gridjs-pages button:hover {
  background-color: #f7f7f7;
  color: rgb(60, 66, 87);
  outline: none;
}
.gridjs-pagination .gridjs-pages button:disabled,
.gridjs-pagination .gridjs-pages button[disabled],
.gridjs-pagination .gridjs-pages button:hover:disabled {
  cursor: default;
  background-color: #fff;
  color: #6b7280;
}
.gridjs-pagination .gridjs-pages button.gridjs-spread {
  cursor: default;
  box-shadow: none;
  background-color: #fff;
}
.gridjs-pagination .gridjs-pages button.gridjs-currentPage {
  background-color: #f7f7f7;
  font-weight: bold;
}
.gridjs-pagination .gridjs-pages button:last-child {
  border-bottom-right-radius: 6px;
  border-top-right-radius: 6px;
  border-right: 1px solid #d2d6dc;
}
.gridjs-pagination .gridjs-pages button:first-child {
  border-bottom-left-radius: 6px;
  border-top-left-radius: 6px;
}
.gridjs-pagination .gridjs-pages button:last-child:focus {
  margin-right: 0;
}

button.gridjs-sort {
  float: right;
  height: 24px;
  width: 13px;
  color: white;
  background-repeat: no-repeat;
  background-position-x: center;
  cursor: pointer;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  background-size: contain;
}
button.gridjs-sort-neutral {
  opacity: 0.3;
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDAxLjk5OHB4IiBoZWlnaHQ9IjQwMS45OThweCIgdmlld0JveD0iMCAwIDQwMS45OTggNDAxLjk5OCIgZmlsbD0iY3VycmVudENvbG9yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gNzMuMDkyIDE2NC40NTIgTCAzMjguOTA1IDE2NC40NTIgQyAzMzMuODU0IDE2NC40NTIgMzM4LjEzOCAxNjIuNjQ1IDM0MS43NTMgMTU5LjAyOCBDIDM0NS4zNjYgMTU1LjQxMiAzNDcuMTggMTUxLjEzIDM0Ny4xOCAxNDYuMTgxIEMgMzQ3LjE4IDE0MS4yMzIgMzQ1LjM2NyAxMzYuOTUyIDM0MS43NTMgMTMzLjMzMSBMIDIxMy44NDYgNS40MjQgQyAyMTAuMjMyIDEuODEyIDIwNS45NTEgMCAyMDAuOTk5IDAgQyAxOTYuMDQ3IDAgMTkxLjc2NiAxLjgxMiAxODguMTQ5IDUuNDI0IEwgNjAuMjQyIDEzMy4zMzEgQyA1Ni42MjUgMTM2Ljk0OCA1NC44MTggMTQxLjIzMiA1NC44MTggMTQ2LjE4MSBDIDU0LjgxOCAxNTEuMTI5IDU2LjYyNSAxNTUuNDEyIDYwLjI0MiAxNTkuMDI4IEMgNjMuODYzIDE2Mi42NDUgNjguMTQ0IDE2NC40NTIgNzMuMDkyIDE2NC40NTIgWiIgc3R5bGU9ImZpbGw6IHJnYigyNTUsIDI1NSwgMjU1KTsiLz4KICA8cGF0aCBkPSJNIDMyOC45MDUgMjM3LjU0OSBMIDczLjA5MiAyMzcuNTQ5IEMgNjguMTQgMjM3LjU0OSA2My44NTkgMjM5LjM1NyA2MC4yNDIgMjQyLjk3IEMgNTYuNjI1IDI0Ni41ODcgNTQuODE4IDI1MC44NjggNTQuODE4IDI1NS44MTcgQyA1NC44MTggMjYwLjc2NiA1Ni42MjUgMjY1LjA1IDYwLjI0MiAyNjguNjY1IEwgMTg4LjE0OSAzOTYuNTcgQyAxOTEuNzcgNDAwLjE4NyAxOTYuMDUxIDQwMS45OTggMjAwLjk5OSA0MDEuOTk4IEMgMjA1Ljk0NyA0MDEuOTk4IDIxMC4yMzIgNDAwLjE4NyAyMTMuODQ2IDM5Ni41NyBMIDM0MS43NTMgMjY4LjY2NCBDIDM0NS4zNjYgMjY1LjA1IDM0Ny4xOCAyNjAuNzY2IDM0Ny4xOCAyNTUuODE2IEMgMzQ3LjE4IDI1MC44NjggMzQ1LjM2NyAyNDYuNTg3IDM0MS43NTMgMjQyLjk2OSBDIDMzOC4xMzkgMjM5LjM1MyAzMzMuODU0IDIzNy41NDkgMzI4LjkwNSAyMzcuNTQ5IFoiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7Ii8+Cjwvc3ZnPg==");
  background-position-y: center;
}
button.gridjs-sort-asc {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSIyOTIuMzYycHgiIGhlaWdodD0iMjkyLjM2MXB4IiB2aWV3Qm94PSIwIDAgMjkyLjM2MiAyOTIuMzYxIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyOTIuMzYyIDI5Mi4zNjE7IgoJIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIGQ9Ik0yODYuOTM1LDE5Ny4yODdMMTU5LjAyOCw2OS4zODFjLTMuNjEzLTMuNjE3LTcuODk1LTUuNDI0LTEyLjg0Ny01LjQyNHMtOS4yMzMsMS44MDctMTIuODUsNS40MjRMNS40MjQsMTk3LjI4NwoJCUMxLjgwNywyMDAuOTA0LDAsMjA1LjE4NiwwLDIxMC4xMzRzMS44MDcsOS4yMzMsNS40MjQsMTIuODQ3YzMuNjIxLDMuNjE3LDcuOTAyLDUuNDI1LDEyLjg1LDUuNDI1aDI1NS44MTMKCQljNC45NDksMCw5LjIzMy0xLjgwOCwxMi44NDgtNS40MjVjMy42MTMtMy42MTMsNS40MjctNy44OTgsNS40MjctMTIuODQ3UzI5MC41NDgsMjAwLjkwNCwyODYuOTM1LDE5Ny4yODd6Ii8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+");
  background-position-y: 35%;
  background-size: 10px;
}
button.gridjs-sort-desc {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSIyOTIuMzYycHgiIGhlaWdodD0iMjkyLjM2MnB4IiB2aWV3Qm94PSIwIDAgMjkyLjM2MiAyOTIuMzYyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyOTIuMzYyIDI5Mi4zNjI7IgoJIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIGQ9Ik0yODYuOTM1LDY5LjM3N2MtMy42MTQtMy42MTctNy44OTgtNS40MjQtMTIuODQ4LTUuNDI0SDE4LjI3NGMtNC45NTIsMC05LjIzMywxLjgwNy0xMi44NSw1LjQyNAoJCUMxLjgwNyw3Mi45OTgsMCw3Ny4yNzksMCw4Mi4yMjhjMCw0Ljk0OCwxLjgwNyw5LjIyOSw1LjQyNCwxMi44NDdsMTI3LjkwNywxMjcuOTA3YzMuNjIxLDMuNjE3LDcuOTAyLDUuNDI4LDEyLjg1LDUuNDI4CgkJczkuMjMzLTEuODExLDEyLjg0Ny01LjQyOEwyODYuOTM1LDk1LjA3NGMzLjYxMy0zLjYxNyw1LjQyNy03Ljg5OCw1LjQyNy0xMi44NDdDMjkyLjM2Miw3Ny4yNzksMjkwLjU0OCw3Mi45OTgsMjg2LjkzNSw2OS4zNzd6Ii8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+");
  background-position-y: 65%;
  background-size: 10px;
}
button.gridjs-sort:focus {
  outline: none;
}

table.gridjs-table {
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  text-align: left;
  display: table;
  margin: 0;
  padding: 0;
  overflow: auto;
  table-layout: fixed;
}

.gridjs-tbody {
  background-color: transparent;
}

td.gridjs-td {
  border-bottom: 1px dashed #e5e7eb;
  padding: 12px 24px;
  background-color: transparent;
  box-sizing: content-box;
}
td.gridjs-td:first-child {
  border-left: none;
}
td.gridjs-td:last-child {
  border-right: none;
}
td.gridjs-message {
  text-align: center;
}

th.gridjs-th {
  position: relative;
  color: #aeafae;
  background-color: transparent;
  border-bottom: 4px solid #353835;
  padding: 14px 24px;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  box-sizing: border-box;
  white-space: nowrap;
  outline: none;
  vertical-align: middle;
  @apply text-xs uppercase;
}
th.gridjs-th .gridjs-th-content {
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  float: left;
}
th.gridjs-th-sort {
  cursor: pointer;
}
th.gridjs-th-sort .gridjs-th-content {
  width: calc(100% - 15px);
}
th.gridjs-th-sort:hover {
  color: #e5e7eb;
}
th.gridjs-th-sort:focus {
  color: #e5e7eb;
}
th.gridjs-th-fixed {
  position: sticky;
  box-shadow: 0 1px 0 0 #e5e7eb;
}
@supports (-moz-appearance: none) {
  th.gridjs-th-fixed {
    box-shadow: 0 0 0 1px #e5e7eb;
  }
}
th.gridjs-th:first-child {
  border-left: none;
}
th.gridjs-th:last-child {
  border-right: none;
}

.gridjs-tr {
  border: none;
}
.gridjs-tr-selected td {
  background-color: #ebf5ff;
}
.gridjs-tr:last-child td {
  border-bottom: 0;
}

.gridjs *,
.gridjs :after,
.gridjs :before {
  box-sizing: border-box;
}

.gridjs-wrapper {
  position: relative;
  z-index: 1;
  overflow: auto;
  width: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: block;
}
.gridjs-wrapper:nth-last-of-type(2) {
  border-bottom: 1px dashed #e5e7eb;
}

.gridjs-search {
  float: left;
}
.gridjs-search-input {
  width: 250px;
}

.gridjs-loading-bar {
  z-index: 10;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  opacity: 0.5;
}
.gridjs-loading-bar::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(204, 204, 204, 0) 0,
    rgba(204, 204, 204, 0.2) 20%,
    rgba(204, 204, 204, 0.5) 60%,
    rgba(204, 204, 204, 0)
  );
  animation: shimmer 2s infinite;
  content: "";
}
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.gridjs-td .gridjs-checkbox {
  display: block;
  margin: auto;
  cursor: pointer;
}

.gridjs-resizable {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 5px;
}
.gridjs-resizable:hover {
  cursor: ew-resize;
  background-color: #9bc2f7;
}
</style>
