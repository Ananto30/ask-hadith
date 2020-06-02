FROM node:14.3.0-alpine as build
WORKDIR /usr/src
COPY ./frontend/package.json ./frontend/package.json
COPY ./frontend/package-lock.json ./frontend/package-lock.json
WORKDIR /usr/src/frontend
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY ./frontend/public ./public
COPY ./frontend/src ./src
RUN npm run build
COPY ./frontend/src/sw.js /usr/src/frontend/build/sw.js

FROM python:3.7.3-slim
COPY --from=build /usr/src/frontend/build /usr/src/frontend/build
COPY ./backend/requirements.txt ./backend/requirements.txt
RUN pip3 install -r ./backend/requirements.txt
WORKDIR /usr/src/backend
COPY ./backend/app.py ./app.py
COPY ./backend/gunicorn_starter.sh ./gunicorn_starter.sh
ENTRYPOINT ["./gunicorn_starter.sh"]
# CMD [ "python3",  "app.py" ]
