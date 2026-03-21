import { reactive } from 'vue'

export interface Group {
  name: string
  url: string
  tags: string
}

const group_data = reactive<Group[]>([
  {
    name: '今天晚上吃什么-大家讨论',
    url: 'https://example.com/s11234123aasd2q2345q12',
    tags: '测试',
  },
  {
    name: 'PDD助力砍一刀',
    url: 'https://example.com/s1ybo2938yro12983iyro9182h3broiu',
    tags: '测试',
  },
  {
    name: '工作内部交流群',
    url: 'https://example.com/sq1234v9rt8yaw8oueyro2r5qwerfqwe',
    tags: '测试',
  },
  {
    name: '项目讨论大群',
    url: 'https://example.com/s09a8hwydeifouygo 2ieufycgoaiw',
    tags: '测试',
  }
  
])

export function useGroupData() {
  return {
    group_data
  }
}
