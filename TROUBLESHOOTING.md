# Troubleshooting Guide

## Common Issues & Solutions

### MongoDB Issues

#### Issue: "connect ECONNREFUSED 127.0.0.1:27017"
**Cause**: MongoDB is not running

**Solution**:
```bash
# macOS
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongodb
```

**Verify MongoDB is running**:
```bash
mongo # or mongosh for newer versions
# If connected, you'll see the mongo shell prompt
```

#### Issue: "Authentication failed" when using MongoDB Atlas
**Cause**: Wrong connection string or credentials

**Solution**:
1. Go to MongoDB Atlas dashboard
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Update `.env` with correct string:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gripx?retryWrites=true&w=majority
```
6. Replace `username`, `password`, and cluster name

### Backend Issues

#### Issue: "Port 5000 already in use"
**Cause**: Another application is using port 5000

**Solution - Option 1: Change the port**
```bash
# Update backend/.env
PORT=5001
```

**Solution - Option 2: Kill the process using port 5000**
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### Issue: "Cannot find module 'express'" when running backend
**Cause**: Dependencies not installed

**Solution**:
```bash
cd backend
npm install
```

#### Issue: Backend crashes on startup
**Check the error message and try**:
```bash
# 1. Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 2. Check .env file exists and has correct values
cat .env

# 3. Check MongoDB is running
mongo # or mongosh

# 4. Restart backend
npm start
```

### Frontend Issues

#### Issue: "Cannot find module '@/app/...'  when starting frontend
**Cause**: Path alias not configured properly

**Solution**: Check `vite.config.ts` has this configuration:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

#### Issue: Blank page or "Cannot GET /" on frontend
**Cause**: Vite dev server not started or port blocked

**Solution**:
```bash
# 1. Make sure you're in the right directory
cd Premiumgamingwebsitedesign-main

# 2. Start the dev server
npm run dev

# 3. Check it's running on localhost:5173
# If not, check for error messages above
```

#### Issue: "Module not found" errors
**Cause**: Dependencies not installed

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Authentication Issues

#### Issue: "Login button doesn't work" or infinite loading
**Cause**: Backend not running or CORS issue

**Debug**:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try login again
4. Look for failed requests

**Solution**:
```bash
# 1. Make sure backend is running
cd backend
npm start

# 2. Check backend is on http://localhost:5000/api
# 3. Check frontend .env.local has correct API URL
cat .env.local
# Should have: VITE_API_URL=http://localhost:5000/api
```

#### Issue: "Invalid credentials" even with correct email/password
**Cause**: User account not created properly, or password hashed incorrectly

**Solution - Register again**:
1. Go to `/register`
2. Use a new email/username combo
3. Make sure password is at least 6 characters
4. Try logging in

**Solution - Check database**:
```javascript
// In MongoDB
use gripx
db.users.find()
// You should see your user entry
```

#### Issue: Dashboard shows 401 "Invalid token" error
**Cause**: Token expired or corrupted

**Solution**:
```bash
# 1. Clear browser localStorage
# Open DevTools → Application → LocalStorage → delete gripx site
# 2. Login again
```

#### Issue: "Token verification failed" message
**Cause**: Backend JWT_SECRET changed or token invalid

**Solution**:
1. Make sure `JWT_SECRET` in `backend/.env` is the same as when you logged in
2. If you changed it, clear localStorage and login again
3. If still not working:
```bash
# Backend .env should have a consistent JWT_SECRET
JWT_SECRET=your_secret_here_same_as_before
```

### API Issues

#### Issue: "Cannot POST /api/products" or 404 errors
**Cause**: Backend API routes not loaded

**Debug**:
```bash
# Test if backend is responding
curl http://localhost:5000/api/health
# Should return: {"message":"Server is running"}
```

**Solution**:
1. Restart backend server
2. Check for error messages in backend terminal
3. Verify all route files exist:
   - `backend/routes/auth.js`
   - `backend/routes/products.js`

#### Issue: "POST request works, but data doesn't save"
**Cause**: MongoDB not receiving data, or validation error

**Debug in DevTools**:
1. Open Network tab
2. Click the failed request
3. Check Response tab for error details
4. Look at backend terminal for error messages

**Solution**:
- Check all required fields are provided:
  ```json
  {
    "name": "Product Name",        // Required
    "category": "Mice",            // Required
    "price": "$79.99",             // Required
    "rating": 4.5,
    "image": "https://...",        // Required
    "specs": "20,000 DPI"          // Required
  }
  ```

#### Issue: "CORS error: Access to XMLHttpRequest blocked"
**Cause**: Frontend and backend CORS mismatch

**Solution**: Make sure:
1. Backend is running on port 5000
2. Frontend `.env.local` has: `VITE_API_URL=http://localhost:5000/api`
3. Both are on localhost (not different IPs)

### Product Management Issues

#### Issue: Cannot add/edit products in dashboard
**Cause**: Not logged in or logged in as non-editor user

**Solution**:
1. Make sure you're logged in (check Login link → Dashboard)
2. Check your user role is "editor" or "admin"
3. To check role:
```javascript
// In MongoDB
use gripx
db.users.findOne({email: "your@email.com"})
// Should show: "role": "editor" or "role": "admin"

// If not, update it:
db.users.updateOne(
  {email: "your@email.com"},
  {$set: {role: "editor"}}
)
```

#### Issue: Product deleted but still showing on homepage
**Cause**: Caching or page not refreshed

**Solution**:
1. Hard refresh the page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Delete product in dashboard again

### Environment Variables

#### Issue: "undefined" environment variables
**Cause**: .env file not created or wrong location

**Solution**:

**For Backend**:
```bash
cd backend
# Create .env file
cp .env.example .env

# Edit .env and set values
nano .env
# Or use your editor to edit backend/.env
```

**For Frontend**:
```bash
# Create .env.local file (at project root)
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

### Performance Issues

#### Issue: Dashboard is very slow loading products
**Cause**: MongoDB query inefficient or many products

**Solution**:
```javascript
// Add database index for better performance
db.products.createIndex({ isActive: 1 })
db.products.createIndex({ category: 1 })
```

#### Issue: Frontend is slow/laggy
**Cause**: Too many components re-rendering

**Solution**:
1. Open DevTools → Performance tab
2. Click Record
3. Interact with app
4. Click Stop and analyze
5. Look for long tasks and optimize

## Getting Help

### Check Logs

**Backend Errors**:
- Look at terminal where you ran `npm start`
- Errors will be printed there

**Frontend Errors**:
- Open DevTools (F12)
- Go to Console tab
- Look for red error messages

**Network Errors**:
- Go to Network tab
- Look for failed requests (red)
- Click on them to see error details

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `MongoNetworkError: connect ECONNREFUSED` | MongoDB not running | Start MongoDB service |
| `EADDRINUSE: address already in use :::5000` | Port 5000 in use | Change PORT in .env or kill process |
| `Cannot POST /api/products` | Route not found | Restart backend |
| `401 Unauthorized` | No valid token | Login again |
| `CORS error` | Frontend/backend mismatch | Check API URL in .env.local |
| `ValidationError: field required` | Missing required field | Provide all required fields |

## Testing

### Test Backend is Working
```bash
curl http://localhost:5000/api/health
# Should output: {"message":"Server is running"}
```

### Test MongoDB Connection
```bash
mongo
# or
mongosh

# Then:
use gripx
show collections
db.users.count()
```

### Test Authentication
```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@test.com",
    "password":"password123"
  }'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@test.com",
    "password":"password123"
  }'

# Save the token from response

# 3. Use token
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:5000/api/auth/me
```

## Still Having Issues?

1. Check the relevant documentation file:
   - `BACKEND_SETUP.md` - Backend/Database setup
   - `API_DOCUMENTATION.md` - API reference
   - `QUICK_START.md` - Quick reference

2. Review error messages carefully - they usually tell you what's wrong

3. Check that all files exist in expected locations

4. Restart both frontend and backend services

5. Clear localStorage and browser cache

If you're still stuck, check these logs:
- Backend terminal output
- Browser DevTools Console
- Browser DevTools Network tab
- MongoDB logs (if local)
