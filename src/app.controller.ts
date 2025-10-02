const crypto = require('crypto');
const axios = require('axios');

import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

require('dotenv').config();

const { ZOLOZ_GATEWAY, ZOLOZ_CLIENT_ID, ZOLOZ_ACCESS_KEY, ZOLOZ_SECRET_KEY } =
  process.env;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async getHello() {
    const method = 'POST';
    const uri = '/api/v1/auth/login';

    const requestTime =
      new Date().toISOString().replace(/\.\d+Z$/, '') + '+0000'; // RFC3339 + timezone

    const body = JSON.stringify({
      title: 'hello',
      description: 'just for demonstration.',
    });

    const bodyStr = JSON.stringify(body);
    const signature = this.signRequest(
      method,
      uri,
      ZOLOZ_CLIENT_ID,
      requestTime,
      bodyStr,
      ZOLOZ_SECRET_KEY,
    );

    try {
      const response = await axios.post(ZOLOZ_GATEWAY + uri, body, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Request-Time': requestTime,
          'Client-Id': ZOLOZ_CLIENT_ID,
          'Auth-Type': 'AKSK',
          'Access-Key': ZOLOZ_ACCESS_KEY,
          Signature: signature,
        },
        timeout: 10000,
      });

      const respBodyStr = JSON.stringify(response.data);
      const respSignature = response.headers['signature'];
      const respTime = response.headers['response-time'];

      const verified = this.verifyResponse(
        method,
        uri,
        ZOLOZ_CLIENT_ID,
        respTime,
        respBodyStr,
        respSignature,
        ZOLOZ_SECRET_KEY,
      );

      console.log('✅ Response:', response.data);
      const data = response.data;
      console.log('🔐 Response signature verified:', verified);

      return data;
    } catch (err) {
      console.log(err.response);
      console.error('❌ Error:', err.response?.data || err.message);
      throw err;
    }
  }

  base64UrlDecode(str) {
    console.log('str', str);
    let s = str.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4 !== 0) s += '=';
    return Buffer.from(s, 'base64');
  }

  base64UrlEncode(buffer) {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  signRequest(method, uri, clientId, requestTime, bodyStr, secretKeyB64Url) {
    const contentToSign = `${method} ${uri}\n${clientId}.${requestTime}.${bodyStr}`;
    const keyBytes = this.base64UrlDecode(secretKeyB64Url);
    const hmac = crypto.createHmac('sha256', keyBytes);
    hmac.update(contentToSign, 'utf8');
    return this.base64UrlEncode(hmac.digest());
  }

  verifyResponse(
    method,
    uri,
    clientId,
    responseTime,
    responseBodyStr,
    signatureHeader,
    secretKeyB64Url,
  ) {
    const contentToVerify = `${method} ${uri}\n${clientId}.${responseTime}.${responseBodyStr}`;
    const expected = this.signRequest(
      method,
      uri,
      clientId,
      responseTime,
      responseBodyStr,
      secretKeyB64Url,
    );
    return expected === signatureHeader;
  }
}
