<script setup lang="ts">
import { ref, onMounted } from 'vue'

const message = ref('')
const reply = ref('')

onMounted(() => {
  // @ts-ignore
  window.electron.on('say-reply', (_, data) => {
    reply.value = data
  })
  // @ts-ignore
  window.electron.on('open-window-state', (_, data) => {
    reply.value = data
  })
})

const sey = () => {
  // @ts-ignore
  window.electron.say(message.value)
}

const openSubpage = () => {
  console.log('open sub page')
  // @ts-ignore
  window.electron.openSubpage()
}

</script>


<template>
  <div class="w-full h-screen flex flex-col justify-center items-center gap-10">
    <h1 class="text-10 font-bold">Hello</h1>

    <input v-model="message" class="outline-none bg-transparent border rounded-lg px-2 py-3 w-80" type="text"
      placeholder="send message">

    <div class="w-100 flex ">
      <span class="shrink-0 text-green-700">main reply：</span>
      <p>{{ reply }}</p>
    </div>

    <div class="flex gap-5">
      <button class="px-3 py-2 border rounded-md hover:border-indigo-500/75 hover:text-indigo-500/75 uppercase"
        @click="sey">send</button>
      <button class="px-3 py-2 border rounded-md hover:border-indigo-500/75 hover:text-indigo-500/75 uppercase"
        @click="openSubpage">open sub page</button>
    </div>
  </div></template>
