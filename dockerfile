FROM node:20

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사 및 설치
COPY package.json /app
COPY package-lock.json /app
RUN npm i

# 소스 파일 복사
COPY . /app

# 빌드 실행
RUN npm run build

CMD ["npm", "run", "dev"]
