import { reactive } from 'vue'

export interface Group {
  name: string
  url: string
}

const group_data = reactive<Group[]>([
  {
    name: '测试群',
    url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key='
  }
])

export function useGroupData() {
  return {
    group_data
  }
}
