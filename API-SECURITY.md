# API Security Implementation

## Overview
This system now restricts API access to only authorized origins (your frontend).

## Security Layers

### 1. Origin Validation (main.ts)
- Blocks requests from unauthorized domains in production
- Only allows: `https://login.morganmallet.agency` and `https://morganmallet.agency`
- Returns 403 for unauthorized origins

### 2. CORS Configuration
- Restricts cross-origin requests to allowed domains
- Configured in `main.ts`

### 3. API Key Guard (Optional)
For extra sensitive endpoints, use the `@RequireApiKey()` decorator.

## Configuration

### Environment Setup
Add to `back/environment/env.json`:
```json
{
  "ApiKey": "your-secure-random-api-key-here"
}
```

**Generate a secure API key:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Usage

### Protect Specific Endpoints
```typescript
import { RequireApiKey } from '../services/decorators/require-api-key.decorator';
import { ApiKeyGuard } from '../services/guards/api-key-guard';

@UseGuards(ApiKeyGuard)
@RequireApiKey()
@Get('sensitive-endpoint')
async sensitiveEndpoint() {
  // This endpoint requires x-api-key header
}
```

### Frontend Integration
Add API key to Angular HTTP interceptor:

```typescript
// In your HTTP interceptor
intercept(req: HttpRequest<any>, next: HttpHandler) {
  const cloned = req.clone({
    setHeaders: {
      'x-api-key': 'your-api-key-here'
    }
  });
  return next.handle(cloned);
}
```

## Testing

### Test Origin Blocking
```bash
# This should be blocked (403)
curl -H "Origin: https://malicious-site.com" https://login.morganmallet.agency/api/candidate-applications

# This should work
curl -H "Origin: https://login.morganmallet.agency" https://login.morganmallet.agency/api/candidate-applications
```

### Test API Key
```bash
# Without API key (401)
curl https://login.morganmallet.agency/api/protected-endpoint

# With API key (200)
curl -H "x-api-key: your-api-key" https://login.morganmallet.agency/api/protected-endpoint
```

## Security Best Practices

1. **Change the default API key** in `env.json` to a strong random value
2. **Store API key securely** in Angular environment files (not in git)
3. **Use HTTPS only** in production
4. **Monitor failed requests** for potential attacks
5. **Rotate API keys** periodically

## Current Protection Status

✅ Origin validation enabled in production
✅ CORS restricted to allowed domains
✅ Security headers (X-Frame-Options, CSP, etc.)
✅ API key guard available for sensitive endpoints

## Deployment

After updating:
```bash
cd /var/www/morgan-mallet-crm/back
pm2 restart mmi
```
