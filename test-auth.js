import { GoogleAuth } from 'google-auth-library';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyFile = path.resolve(__dirname, 'top-telegram-links-0ff5b28cd97a.json');

async function testAuth() {
  try {
    console.log("Using keyFile:", keyFile);
    const auth = new GoogleAuth({
      keyFile: keyFile,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const client = await auth.getClient();
    console.log("Client created successfully, getting access token...");
    
    const token = await client.getAccessToken();
    console.log("Token obtained", Boolean(token.token));
  } catch (err) {
    console.error("Auth error details:", err);
  }
}

testAuth();
