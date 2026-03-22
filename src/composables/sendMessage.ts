import { fetch } from '@tauri-apps/plugin-http'

export interface SendMessageOptions {
  url: string
  text: string
  isAtAll?: boolean
}

export interface SendMessageResponse {
  errcode: number
  errmsg: string
}

export async function sendMessage({ url, text, isAtAll = false }: SendMessageOptions): Promise<SendMessageResponse> {
    const atAll = isAtAll ? '@all' : ''
    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        msgtype: 'text',
        text: {
            content: text,
            mentioned_list: [atAll],
        },
        }),
    })

  return await response.json() as SendMessageResponse
}
