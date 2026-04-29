# Usa una versione leggera di Node.js
FROM node:18-slim

# Crea la cartella di lavoro nel contenitore
WORKDIR /app

# Copia i file di configurazione
COPY package*.json ./

# Installa le dipendenze (axios, cheerio, sdk)
RUN npm install --production

# Copia il resto del codice del plugin
COPY . .

# Esponi la porta usata dallo Stremio SDK (solitamente 7000)
EXPOSE 7000

# Comando per avviare il plugin
CMD ["node", "cb01-addon.js"]
