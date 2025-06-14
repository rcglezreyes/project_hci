# ./django/Dockerfile
FROM python:3.12

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --upgrade pip
RUN pip install gunicorn
RUN pip install uvicorn
RUN pip install -r requirements.txt

RUN apt-get update && apt-get install -y wget gnupg2 lsb-release

RUN apt-get update

COPY . /app/

EXPOSE 8001

CMD ["sh", "-c", "python manage.py makemigrations --no-input && \
                  python manage.py migrate --no-input && \
                  python manage.py collectstatic --no-input && \
                  python init_scripts.py && \
                  celery -A system_project_hci worker --loglevel=info -E & \
                  celery -A system_project_hci beat --loglevel=info & \
                  gunicorn system_project_hci.asgi:application -w 3 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001"]
