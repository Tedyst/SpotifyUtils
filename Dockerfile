FROM python:3.7@sha256:c1e36afba1c3c230a6846801fb284cf4383a8a0080fcf32c2ec625c066c56361

WORKDIR /app/api
VOLUME /data

COPY api/requirements.txt /app/api/requirements.txt
RUN ["pip", "install", "-r", "/app/api/requirements.txt"]

CMD ["flask", "run", "--host", "0.0.0.0"]
ENV APP_ENV=docker

COPY api/ /app/api
COPY build/ /app/build