<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { computed } from 'vue'

const props = defineProps({
    group: {
        type: Object,
        default: () => ({})
    },
    modelValue: {
        type: Array as () => string[],
        default: () => []
    }
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const isChecked = computed(() => props.modelValue.includes(props.group.url))

const toggleGroup = () => {
  const checked = props.modelValue.includes(props.group.url)
  const newChecked = [...props.modelValue]
  if (checked) {
    const index = newChecked.indexOf(props.group.url)
    if (index > -1) {
      newChecked.splice(index, 1)
    }
  } else {
    newChecked.push(props.group.url)
  }
  emit('update:modelValue', newChecked)
}
</script>

<template>
    <div 
        :class="[
            'h-10 hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
            isChecked ? 'border-blue-500' : 'border-input'
        ]"
        @click="toggleGroup"
    >
        <!-- <Checkbox
            :id="group.url"
            :checked="isChecked"
            :class="{isChecked: 'checked'}"
            class="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700 pointer-events-none"
        /> -->
        <div class="gap-1 flex items-center justify-center">
            <p class="text-xs leading-none">
            {{ group.name }}
            </p>
        </div>
    </div>
</template>