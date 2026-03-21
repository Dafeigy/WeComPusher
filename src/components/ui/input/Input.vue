<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { useVModel } from "@vueuse/core"
import { cn } from "@/lib/utils"
import { ref } from 'vue'
import {Eye, EyeClosed} from "lucide-vue-next"

const props = defineProps<{
    defaultValue?: string | number
    modelValue?: string | number
    class?: HTMLAttributes['class']
    type: string
}>()

const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
})

const showPassword = ref(false)
</script>

<template>
  <div class="relative">
    <input v-model="modelValue"
           :class="cn('flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50', props.class) + (type==='password'? ' pr-9': '')"
           :type="showPassword ? 'text' : type">
    <div v-if="type === 'password'"
         class="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-500 transition-colors"
         @click="showPassword = !showPassword">
        <EyeClosed v-if="!showPassword" class="w-4 h-4"/>
        <Eye v-else class="w-4 h-4"/>
    </div>
</div>
</template>
