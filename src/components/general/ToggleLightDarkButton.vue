<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Button from '@/components/ui/button/Button.vue';
import {Moon, Sun} from 'lucide-vue-next';
import { useColorMode } from '@vueuse/core'
const mode = useColorMode()
</script>

<template>
<TooltipProvider>
    <Tooltip>
    <TooltipTrigger>
        <Button class="mx-1/2 " size="sm" variant="ghost" @click="mode = mode === 'dark' ? 'light' : 'dark'"><Moon v-if="mode === 'light'"></Moon><Sun v-else></Sun></Button>
    </TooltipTrigger>
    <TooltipContent>
        <p v-if="mode === 'light'">切换暗色模式</p>
        <p v-else>切换亮色模式</p>
    </TooltipContent>
    </Tooltip>
</TooltipProvider>
</template>