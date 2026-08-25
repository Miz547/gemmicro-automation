FROM mcr.microsoft.com/playwright:v1.61.1-jammy

WORKDIR /qa

COPY playwright-tool/package*.json ./
RUN npm ci

COPY playwright-tool ./

ENV BASE_URL=https://www.gemmicro.com.tw/zh-TW/

CMD ["npm", "run", "test:smoke"]
