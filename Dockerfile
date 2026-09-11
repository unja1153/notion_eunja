FROM node:20-slim
RUN npm install -g @notionhq/notion-mcp-server
WORKDIR /app
COPY proxy.js .
CMD ["sh", "-c", "notion-mcp-server --transport http --host 127.0.0.1 --port 4000 --auth-token local-internal-secret & node proxy.js"]
