<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();

const count = ref(0);

const callMain = () => {
  // @ts-ignore
  window.electron.ipcRenderer.send("0101", count.value);
  count.value++;
};

const openSubPage = () => {
  console.log("打开子页面");
  // @ts-ignore
  window.electron.ipcRenderer.send("openSubPage", count.value);
};
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button class="m-10" type="button" @click="callMain">
      count is {{ count }}
    </button>
    <button class="m-10" type="button" @click="openSubPage">
      open sub page
    </button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}

.m-10 {
  margin: 0 10px;
}
</style>
