FROM python:3.7

WORKDIR /app/api
VOLUME /data

COPY api/requirements.txt /app/api/requirements.txt
RUN ["pip", "install", "-r", "/app/api/requirements.txt"]

CMD ["flask", "run", "--host", "0.0.0.0"]
ENV APP_ENV=docker

COPY api/ /app/api
COPY build/ /app/build