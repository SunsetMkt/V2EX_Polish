import { defaultOptions, StorageKey } from './constants'
import { deepMerge } from './deep-merge'
import type { Options, PersonalAccessToken, StorageData } from './types'

/**
 * 获取用户的操作系统。
 */
export function getOS() {
  const userAgent = window.navigator.userAgent.toLowerCase()
  const macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i
  const windowsPlatforms = /(win32|win64|windows|wince)/i
  const iosPlatforms = /(iphone|ipad|ipod)/i

  let os: 'macos' | 'ios' | 'windows' | 'android' | 'linux' | null = null

  if (macosPlatforms.test(userAgent)) {
    os = 'macos'
  } else if (iosPlatforms.test(userAgent)) {
    os = 'ios'
  } else if (windowsPlatforms.test(userAgent)) {
    os = 'windows'
  } else if (userAgent.includes('android')) {
    os = 'android'
  } else if (userAgent.includes('linux')) {
    os = 'linux'
  }

  return os
}

/**
 * 将时间戳格式化为「年月日 时:分:秒」。
 */
export function formatTimestamp(
  timestamp: number,
  { format = 'YMD' }: { format?: 'YMD' | 'YMDHMS' } = {}
) {
  const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp)
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  const YMD = `${year}-${month}-${day}`

  if (format === 'YMDHMS') {
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    const second = date.getSeconds().toString().padStart(2, '0')

    return `${YMD} ${hour}:${minute}:${second}`
  }

  return YMD
}

/**
 * 比较两个时间戳是否为同一天。
 */
export function isSameDay(timestamp1: number, timestamp2: number): boolean {
  const date1 = new Date(timestamp1)
  const date2 = new Date(timestamp2)

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * 获取用户设置存储的个人访问令牌。
 */
export function getPAT(): Promise<PersonalAccessToken> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || typeof chrome.storage === 'undefined') {
      return resolve(undefined)
    }

    chrome.storage.sync.get(StorageKey.API, (result: StorageData) => {
      resolve(result[StorageKey.API]?.pat)
    })
  })
}

/**
 * 获取用户存储的自定义设置。
 */
export function getOptions(): Promise<Options> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || typeof chrome.storage === 'undefined') {
      return resolve(defaultOptions)
    }

    chrome.storage.sync.get(StorageKey.Options, (result: StorageData) => {
      const options = result[StorageKey.Options]

      if (options) {
        resolve(deepMerge(defaultOptions, options))
      } else {
        resolve(defaultOptions)
      }
    })
  })
}

/**
 * 转义 HTML 字符串中的特殊字符。
 */
export function escapeHTML(htmlString: string): string {
  return htmlString.replace(/[<>&"'']/g, (match) => {
    switch (match) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case '"':
        return '&quot;'
      case "'":
        return '&#39;'
      default:
        return match
    }
  })
}
