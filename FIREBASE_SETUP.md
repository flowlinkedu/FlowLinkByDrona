# Firebase Setup Guide for FlowLink

## ✅ Configuration Complete

Your Firebase project is already configured with the following details:
- **Project ID**: flowlinkkiro
- **Auth Domain**: flowlinkkiro.firebaseapp.com
- **Analytics**: Enabled

## Current Setup Status

✅ **Firebase Configuration**: Complete  
✅ **Authentication Methods**: Ready to enable  
⏳ **Testing**: Ready to test  

## Step 1: Enable Authentication Methods

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **flowlinkkiro**
3. Navigate to **Authentication** > **Sign-in method**
4. Enable the following providers:

### Email/Password Authentication
- Click on **Email/Password**
- Toggle **Enable** to ON
- Click **Save**

### Google Sign-in
- Click on **Google**
- Toggle **Enable** to ON
- Set **Project public-facing name**: "FlowLink"
- Choose a **Project support email**
- Click **Save**

## Step 2: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings**
2. Scroll to **Authorized domains**
3. Add your domains:
   - `localhost` (for development)
   - Your production domain when ready

## Step 3: Test the Application

### Local Development
```bash
# Install dependencies
npm install

# Start local server
npm run dev
```

Then visit: `http://localhost:8000/login.html`

### Testing Checklist
- [ ] Email/password registration
- [ ] Email/password login
- [ ] Google sign-in
- [ ] Dashboard access after login
- [ ] Sign-out functionality

## Step 4: Verify Firebase Console

After testing, check your Firebase Console:
1. Go to **Authentication** > **Users**
2. You should see registered users
3. Check **Analytics** for usage data

## Security Rules (Optional)

For future database integration, set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access for announcements
    match /announcements/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Environment Variables (Production)

For production, consider using environment variables:

```javascript
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};
```

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to Authorized domains in Firebase Console

2. **"Firebase: Error (auth/api-key-not-valid)"**
   - Check if API key is correct in firebase-config.js

3. **Google Sign-in popup blocked**
   - Ensure popup blockers are disabled
   - Check browser console for errors

4. **Module import errors**
   - Ensure you're serving files via HTTP/HTTPS (not file://)
   - Use a local server like Live Server extension in VS Code

### Testing Locally:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then access: `http://localhost:8000/login.html`

## Next Steps

1. Set up user profiles in Firestore
2. Implement role-based access control
3. Add password reset functionality
4. Set up email verification
5. Implement user management dashboard

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth/web/start)
- [Firebase Console](https://console.firebase.google.com/)