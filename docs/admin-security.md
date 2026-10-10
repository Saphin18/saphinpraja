# Admin security — Supabase settings

The code handles sign-in, password reset and "sign out everywhere". These five settings
live in the Supabase dashboard instead, and the reset flow will **not** work until the
first one is done. Project → <https://supabase.com/dashboard/project/hmfddmvzwuhqslfgmdqo>

## 1. Allow the reset links to come back (required)

**Authentication → URL Configuration**

- **Site URL**: `https://saphinpraja.com.np`
- **Redirect URLs** — add each of these on its own line:
  ```
  https://saphinpraja.com.np/admin
  https://admin.saphinpraja.com.np/**
  http://localhost:3000/admin
  ```

Reset emails send you back to whichever page you asked from. Supabase silently refuses any
address not on this list, so a missing entry shows up as a link that dumps you on the home
page instead of the "choose a new password" screen.

## 2. Stop strangers creating accounts (required)

**Authentication → Sign In / Providers → Email**

- Turn **off** "Allow new users to sign up".
- Keep **"Confirm email"** on.

Row-level security already means a stranger's account can't read or change anything, but
with signups open they can still make accounts in your project and burn your email quota.
One admin account is all this site ever needs.

## 3. Raise the password floor

**Authentication → Policies** (or Sign In / Providers → Password settings)

- **Minimum password length**: `8` — matches `MIN_PASSWORD` in `src/routes/admin.tsx`.
- **Password requirements**: letters, digits and symbols.
- **Leaked password protection**: on, if your plan offers it. It checks new passwords
  against known breach lists.

## 4. Shorten the window on reset links

**Authentication → Emails → Email Templates / expiry**

- **Email link expiry**: `3600` (one hour). Long enough to find the email, short enough
  that an old one in your inbox is useless.

The links are already single-use: once a password is set, the token is spent, and the code
strips it from the address bar so it can't be re-shared from your browser history.

## 5. Keep the brute-force limits

**Authentication → Rate Limits** — the defaults are fine. Worth knowing what they are:

- Password reset emails: ~2 per hour, per address.
- Sign-in attempts: ~30 per 5 minutes, per IP.

The "Reset your password" form only ever sends mail to the admin address, and shows the
same "check your email" message for every address, so it can't be used to probe for
accounts or to send mail to other people.

## If you're locked out completely

If you lose the Gmail inbox as well as the password:

**Authentication → Users → `prajasaphin18@gmail.com` → ⋯ → Reset password**

That is the deliberate break-glass route. It's why there's no second recovery email in the
app — one inbox to protect is safer than two, and the dashboard already covers the
worst case.

## Changing the admin email

It appears in three places and all three must agree:

1. `ADMIN_EMAIL` in `src/routes/admin.tsx`
2. `is_portfolio_admin()` in `docs/admin-setup.sql` (re-run the file after editing)
3. The user's email in Supabase → Authentication → Users
