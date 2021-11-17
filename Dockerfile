FROM python:3.7.3-slim
COPY backend/requirements.txt backend/requirements.txt
RUN pip3 install -r backend/requirements.txt

WORKDIR /usr/src/backend
COPY backend/src src
COPY backend/gunicorn_starter.sh gunicorn_starter.sh
ENTRYPOINT ["./gunicorn_starter.sh"]