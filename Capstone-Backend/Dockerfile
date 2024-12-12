# Gunakan image Node.js
FROM node:18

# Set working directory
WORKDIR /src

# Salin package.json dan install dependencies
COPY package*.json ./ 
RUN npm install

# Salin seluruh file ke dalam container
COPY . .
ENV PORT=4159
# Expose port yang digunakan oleh aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD [ "npm", "run", "start"]
