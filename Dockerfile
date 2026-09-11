FROM node:20-slim
RUN npm install -g @notionhq/notion-mcp-server
CMD ["sh", "-c", "notion-mcp-server --transport http --host 0.0.0.0"]
