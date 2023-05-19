<template>
  <div className="container">
    <div className="tag-list">
      <div className="loop-slider">
        <div className="inner">
          <div className="tag">{{ text }}</div>
          <div className="tag">{{ text }}</div>
          <div className="tag">{{ text }}</div>
          <div className="tag">{{ text }}</div>
          <div className="tag">{{ text }}</div>
          <div className="tag">{{ text }}</div>
          <div className="tag">{{ text }}</div>
          <div className="tag">{{ text }}</div>
          <div className="tag">{{ text }}</div>
          <div className="tag">{{ text }}</div>
          <div className="tag">{{ text }}</div>
          <div className="tag">{{ text }}</div>
          <div className="tag">{{ text }}</div>
          <div className="tag">{{ text }}</div>
          <div className="tag">{{ text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
});
</script>
<style scoped>
.tag-list {
  width: 100%;
  /* max-width: 90vw; */
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 1rem 0;
  position: relative;
  padding: 1rem 0;
  overflow: hidden;
}

.loop-slider .inner {
  display: flex;
  width: fit-content;
  animation-name: loop;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-duration: 5s;
}

.tag {
  display: flex;
  align-items: center;
  gap: 0 0.2rem;
  margin-right: 1rem;
}

@keyframes loop {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-20%);
  }
}
</style>
