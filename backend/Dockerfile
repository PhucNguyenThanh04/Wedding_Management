FROM python:3.12-slim
LABEL authors="thanh-phuc"

# Cài đặt thư viện hệ thống cần cho psycopg2-binary
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /backend

# Copy requirements trước để tận dụng Docker layer cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ source code
COPY . .

# Tạo thư mục uploads nếu chưa có
RUN mkdir -p uploads/invoices

# Port mặc định của uvicorn
EXPOSE 8000

# Chạy ứng dụng
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
