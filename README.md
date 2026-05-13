# DC CUSTOMER'S App

## কাস্টমার ম্যানেজমেন্ট অ্যাপ্লিকেশন

### ফিচারস

1. **PIN-ভিত্তিক লগইন** - ৪ সংখ্যার PIN দিয়ে নিরাপদ লগইন
2. **আনলিমিটেড পেজ** - যত খুশি পেজ তৈরি করুন
3. **ডেটা ম্যানেজমেন্ট** - পেজের মধ্যে আনলিমিটেড রো
4. **সার্চ ফাংশনালিটি** - দ্রুত ডেটা খুঁজুন
5. **ড্যাশবোর্ড** - অটো ক্যালকুলেশন
6. **কালার কোডিং** - লাল, সবুজ, পিংক, সাধারণ
7. **ভেরিফিকেশন** - টিকবক্স সহ সাউন্ড ফিডব্যাক
8. **পেজ ক্লোজ** - PIN দিয়ে পেজ লক/আনলক

### ইনস্টলেশন

```bash
npm install
npm run dev
```

### ডাটাবেস

SQLite3 ব্যবহার করা হয়েছে। ডাটাবেস স্বয়ংক্রিয়ভাবে `data/app.db`-এ তৈরি হবে।

### API এন্ডপয়েন্টস

#### Auth
- `POST /api/auth/register` - নতুন ব্যবহারকারী রেজিস্টার করুন
- `POST /api/auth/login` - লগইন করুন

#### Pages
- `POST /api/pages/create` - নতুন পেজ তৈরি করুন
- `GET /api/pages/user/:userId` - সব পেজ পান
- `GET /api/pages/:pageId` - একটি পেজ পান
- `GET /api/pages/:pageId/dashboard` - ড্যাশবোর্ড ডেটা
- `PUT /api/pages/:pageId/close` - পেজ বন্ধ করুন
- `PUT /api/pages/:pageId/reopen` - পেজ খুলুন

#### Data
- `POST /api/data/add` - নতুন রো যোগ করুন
- `PUT /api/data/:rowId` - রো আপডেট করুন
- `PUT /api/data/:rowId/verify` - রো ভেরিফাই করুন
- `PUT /api/data/:rowId/color` - রঙ পরিবর্তন করুন
- `DELETE /api/data/:rowId` - রো ডিলিট করুন
- `GET /api/data/search/:pageId` - ডেটা সার্চ করুন
