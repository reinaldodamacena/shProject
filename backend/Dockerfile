FROM python:3.9-alpine

WORKDIR /app

# Install build dependencies
RUN apk update && \
    apk add --virtual build-deps gcc python3-dev musl-dev

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project files
COPY . .

# Set environment variables for Django settings
ENV DJANGO_SETTINGS_MODULE=myproject.settings
ENV DATABASE_URL=sqlite:///db.sqlite3

# Run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
