# EAS Build এবং Submit এর জন্য সেটআপ গাইড

## পূর্বশর্ত

1. **Expo CLI ইনস্টল করুন**
```bash
npm install -g eas-cli expo-cli
```

2. **Expo Account তৈরি করুন** (https://expo.dev)

3. **EAS CLI এ লগইন করুন**
```bash
eas login
```

## Build Profile ব্যবহার করুন

### Development Build (আপনার ডিভাইসে টেস্ট করার জন্য)
```bash
eas build --platform android --profile development
```

### Preview Build (Internal Distribution এর জন্য)
```bash
eas build --platform android --profile preview
```

### Production Build (Google Play Store এর জন্য)
```bash
eas build --platform android --profile production
```

### iOS Development
```bash
eas build --platform ios --profile ios-preview
```

### iOS Production
```bash
eas build --platform ios --profile ios-production
```

## সম্পূর্ণ বিল্ড প্রক্রিয়া

### ধাপ 1: Git সেটআপ করুন
```bash
git init
git add .
git commit -m "Initial commit"
```

### ধাপ 2: EAS Project সেটআপ করুন
```bash
eas project:create
```

### ধাপ 3: নির্ভরতা ইনস্টল করুন
```bash
cd mobile
npm install
```

### ধাপ 4: Build করুন
```bash
eas build --platform android
```

### ধাপ 5: Google Play Store এ Submit করুন (Optional)
```bash
eas submit --platform android
```

## সমস্যা সমাধান

### 1. Git সমস্যা
```bash
# সম্পূর্ণ রিপোজিটরি দিয়ে করুন
eas build --platform android --non-interactive
```

### 2. নির্ভরতা সমস্যা
```bash
cd mobile
rm -rf node_modules
npm install
cd ..
```

### 3. Cache সাফ করুন
```bash
cd mobile
rm -rf ~/.eas
npm cache clean --force
npm install
```

## Advanced Configuration

### eas.json বিস্তারিত

- **development**: ডেভেলপার মোড, হট রিলোড সাপোর্ট
- **preview**: বিটা টেস্���িং, internal distribution
- **production**: স্টোর সাবমিশন
- **android-preview**: APK ফাইল (সরাসরি ইনস্টল)
- **android-production**: AAB ফাইল (Google Play)
- **ios-preview**: টেস্টফ্লাইট এর জন্য
- **ios-production**: App Store এর জন্য

## Keystore সেটআপ (Android)

### প্রথমবার
```bash
eas build --platform android --profile production
# EAS স্বয়ংক্রিয়ভাবে keystore তৈরি করবে
```

### পরবর্তী বার
```bash
eas build --platform android --profile production
# একই keystore ব্যবহার করবে
```

## iOS সার্টিফিকেট

```bash
eas credentials
```

এই কমান্ড দিয়ে সার্টিফিকেট ম্যানেজ করুন।

## বিল্ড স্ট্যাটাস চেক করুন

```bash
eas build:list
```

## দ্রুত রেফারেন্স

```bash
# সব কমান্ড
eas --help

# বিল্ড হিস্ট্রি
eas build:list

# বিল্ড লগ দেখুন
eas build:view <BUILD_ID>

# Credentials ম্যানেজ করুন
eas credentials

# Submit করুন
eas submit --platform android --latest
```

## গুরুত্বপূর্ণ নোট

1. **Server IP আপডেট করুন** মোবাইল কোডে (`YOUR_SERVER_IP:5000`)
2. **Backend Server চলতে হবে** APK টেস্টের সময়
3. **নেটওয়ার্ক সংযোগ** প্রয়োজন
4. **Google Play Account** স্টোর সাবমিশনের জন্য

## উপযোগী লিংক

- Expo Documentation: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction/
- EAS Submit: https://docs.expo.dev/submit/introduction/
