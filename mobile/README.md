# DC CUSTOMER'S Mobile App

## মোবাইল অ্যাপ্লিকেশন সেটআপ গাইড

### সিস্টেম প্রয়োজনীয়তা

- Node.js (v14 বা তার উপরে)
- npm অথবা yarn
- Android Studio (Android এর জন্য)
- Xcode (iOS এর জন্য)

### ইনস্টলেশন

```bash
# প্রজেক্ট ফোল্ডার এ যান
cd mobile

# নির্ভরতা ইনস্টল করুন
npm install

# অথবা yarn ব্যবহার করুন
yarn install
```

### সার্ভার URL পরিবর্তন করুন

`src/screens/LoginScreen.js` এবং অন্যান্য স্ক্রিনে `YOUR_SERVER_IP:5000` কে আপনার সার্ভারের IP দিয়ে প্রতিস্থাপন করুন।

উদাহরণ: `http://192.168.1.100:5000`

### Android এ চালান

```bash
# মেট্রো বান্ডলার শুরু করুন
npm start

# নতুন টার্মিনালে
npm run android
```

### APK তৈরি করুন

```bash
# Release APK তৈরি করুন
npm run build-apk

# APK ফাইল পাবেন: android/app/build/outputs/apk/release/app-release.apk
```

### iOS এ চালান

```bash
# মেট্রো বান্ডলার শুরু করুন
npm start

# নতুন টার্মিনালে
npm run ios
```

## ফিচারস

✅ PIN-ভিত্তিক লগইন  
✅ আনলিমিটেড পেজ এবং রো  
✅ ড্যাশবোর্ড উইথ অটো ক্যালকুলেশন  
✅ ডেটা সার্চ  
✅ রঙ কোডিং  
✅ টিক বক্স যাচাই  
✅ কপি ফাংশনালিটি  
✅ পেজ ক্লোজিং  

## টাবলশুটিং

### মেট্রো বান্ডলার ক্যাশ ক্লিয়ার করুন

```bash
npm start -- --reset-cache
```

### Android ক্যাশ ক্লিয়ার করুন

```bash
cd android
./gradlew clean
cd ..
```

### সার্ভার সংযোগ সমস্যা

নিশ্চিত করুন যে আপনার ব্যাকএন্ড সার্ভার চলছে এবং সঠিক URL ব্যবহার করছেন।

## উৎপাদনের জন্য APK স্বাক্ষর করা

```bash
cd android
./gradlew bundleRelease
```

স্বাক্ষরিত APK ব্যবহার করে Google Play Store এ প্রকাশ করুন।
