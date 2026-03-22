import { fetch } from '@tauri-apps/plugin-http'

export interface NewsArticle {
  title: string
  description: string
  url: string
  picurl?: string
}

export interface SendMessageOptions {
  url: string
  text?: string
  msgtype?: 'text' | 'news'
  news?: {
    articles: NewsArticle[]
  }
  isAtAll?: boolean
}

export interface SendMessageResponse {
  errcode: number
  errmsg: string
}

export async function sendMessage({ url, text, msgtype = 'text', news, isAtAll = false }: SendMessageOptions): Promise<SendMessageResponse> {
    const atAll = isAtAll ? '@all' : ''
    
    const body: any = {
        msgtype: msgtype
    }
    
    if (msgtype === 'text') {
        body.text = {
            content: text,
            mentioned_list: [atAll],
        }
    } else if (msgtype === 'news') {
        body.news = news
    }
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })

  return await response.json() as SendMessageResponse
}
