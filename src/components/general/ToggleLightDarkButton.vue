<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import {TooltipProvider, Tooltip, TooltipTrigger, TooltipContent} from '@/components/ui/tooltip'
import {Moon, Sun} from 'lucide-vue-next'
import Button from '../ui/button/Button.vue'
// 使用 VueUse 的 useDark 函数来管理暗黑模式状态
const isDark = useDark({
  selector: 'html',
  attribute: 'data-bs-theme',
  valueDark: 'dark',
  valueLight: 'light'
})

// 使用 useToggle 函数来切换暗黑模式
const toggleDark = useToggle(isDark)

// 主题切换函数
const toggleTheme = (event: MouseEvent) => {
  // 获取点击位置坐标
  const x = event.clientX
  const y = event.clientY
  
  // 计算结束半径（从点击位置到屏幕最远点的距离）
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  )

  // 兼容性处理：如果浏览器不支持 View Transitions API，则直接切换主题
  if (!document.startViewTransition) {
    toggleDark()
    return
  }

  // 使用 View Transitions API 创建过渡效果
  const transition = document.startViewTransition(async () => {
    toggleDark()
  })

  // 过渡准备就绪后，执行动画
  transition.ready.then(() => {
    // 定义圆形裁剪路径
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    
    // 根据当前主题状态决定动画方向
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 500,
        easing: "ease-in",
        fill: 'forwards',
        pseudoElement: isDark.value
          ? "::view-transition-old(root)"
          : "::view-transition-new(root)",
      }
    )
  })
}
</script>

<template>
<TooltipProvider>
    <Tooltip>
    <TooltipTrigger>
        <div class="theme-container" ref="container">
            <Button class="" @click="toggleTheme" variant="ghost">
                <Moon v-if="isDark" />
                <Sun v-else />
            </Button>
        </div>
    </TooltipTrigger>
    <TooltipContent>
        <p v-if="!isDark">切换暗色模式</p>
        <p v-else>切换亮色模式</p>
    </TooltipContent>
    </Tooltip>
</TooltipProvider>
</template>