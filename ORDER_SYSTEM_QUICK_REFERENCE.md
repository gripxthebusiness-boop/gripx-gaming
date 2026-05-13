# 📦 Order System - Quick Reference

## File Structure Created

```
PROJECT_ROOT/
├── backend/
│   ├── models/
│   │   └── Order.js                 # ✨ NEW - Order database schema
│   ├── controllers/
│   │   └── orderController.js       # ✨ NEW - Order business logic
│   ├── routes/
│   │   └── orders.js                # ✨ NEW - Order API endpoints
│   ├── server.js                    # ✅ UPDATED - Added order routes
│   ├── package.json                 # ✅ UPDATED - Added axios
│   └── .env.example                 # ✅ UPDATED - Added Telegram vars
│
├── src/
│   ├── services/
│   │   └── orderService.ts          # ✨ NEW - Frontend API client
│   └── app/
│       └── components/
│           ├── OrderForm.tsx         # ✨ NEW - Full order form
│           └── BuyNowButton.tsx      # ✨ NEW - Quick checkout button
│
└── ORDER_SYSTEM_SETUP.md             # ✨ NEW - Complete guide (this file)
```

## Quick Commands

### Backend Setup
```bash
cd backend
npm install axios
npm run dev           # Start backend on port 5000
```

### Frontend Setup
```bash
npm install
npm run dev           # Start frontend on port 5173
```

### Test Order API
```bash
# Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "product":"Mouse",
    "quantity":1,
    "price":29.99,
    "customer":"John",
    "phone":"1234567890",
    "address":"123 St"
  }'

# Get all orders
curl http://localhost:5000/api/orders

# Get stats
curl http://localhost:5000/api/orders/stats
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://...
JWT_SECRET=your_secret
BOT_TOKEN=telegram_token
CHAT_ID=telegram_chat_id
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=...
```

## Component Usage

### OrderForm (Full Page)
```tsx
import OrderForm from '@/app/components/OrderForm';

export default function CheckoutPage() {
  return (
    <OrderForm 
      productName="Gaming Mouse"
      productPrice={49.99}
      onSuccess={(orderId) => console.log('Success!', orderId)}
    />
  );
}
```

### BuyNowButton (Quick Checkout)
```tsx
import BuyNowButton from '@/app/components/BuyNowButton';

export default function ProductCard() {
  return (
    <BuyNowButton
      productName="Gaming Mouse"
      productPrice={49.99}
      onSuccess={(orderId) => navigate('/thank-you')}
    />
  );
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | Get all orders (admin) |
| GET | `/api/orders/:id` | Get specific order |
| PUT | `/api/orders/:id` | Update order status |
| DELETE | `/api/orders/:id` | Delete order |
| GET | `/api/orders/stats` | Get statistics |

## Telegram Setup

1. **Create Bot**: Chat with [@BotFather](https://t.me/botfather)
   - `/newbot` → Follow prompts → Get BOT_TOKEN

2. **Get Chat ID**:
   - Send message to your bot
   - Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - Find chat ID in response

3. **Configure Backend**:
   - Add `BOT_TOKEN` and `CHAT_ID` to `.env`

4. **Test**: Place an order → Check Telegram

## Deployment URLs

| Service | URL | Environment |
|---------|-----|-------------|
| Backend | https://gripx-gaming-api.onrender.com | VITE_API_URL for production |
| Frontend | https://gripx-gaming.vercel.app | Vercel deployment |
| Database | MongoDB Atlas cluster | MONGO_URI |

## Validation

### Required Order Fields
- ✅ `customer` - Customer name (2-50 chars)
- ✅ `phone` - Phone number (10-15 digits)
- ✅ `address` - Delivery address (5-200 chars)
- ✅ `product` - Product name
- ✅ `quantity` - Quantity (1-1000)
- ✅ `price` - Product price

### Optional Fields
- `email` - Customer email
- `city` - City name
- `postalCode` - Postal/ZIP code
- `notes` - Special instructions

## Error Handling

### Frontend
```typescript
const result = await createOrder(orderData);
if (result.success) {
  // Order created successfully
  console.log(result.data);
} else {
  // Handle error
  console.error(result.error);
}
```

### Backend Error Responses
```json
{
  "success": false,
  "message": "Customer name is required",
  "field": "customer"
}
```

## Security

✅ Environment variables keep secrets safe
✅ CORS configured for authorized origins
✅ Rate limiting prevents abuse
✅ Input validation on backend
✅ Error messages don't expose sensitive info

## Performance

- ✅ Database indexes on createdAt, status, phone
- ✅ Response compression enabled
- ✅ Caching for GET requests
- ✅ Connection pooling (10 max)

## Monitoring

### Health Check
```bash
curl https://gripx-gaming-api.onrender.com/api/health
```

### Check Order Stats
```bash
curl https://gripx-gaming-api.onrender.com/api/orders/stats
```

---

**Everything is production-ready! 🎉**
