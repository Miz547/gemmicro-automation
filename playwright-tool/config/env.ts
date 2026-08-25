const DEFAULT_BASE_URL = "https://www.gemmicro.com.tw/zh-TW/";

export function getBaseUrl() {
  const baseUrl = process.env.BASE_URL || DEFAULT_BASE_URL;
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

export function appUrl(pathname: string) {
  return new URL(pathname.replace(/^\/+/, ""), getBaseUrl()).toString();
}
