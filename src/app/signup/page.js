'use client';

import styles from '../auth.module.css';
import Link from 'next/link';
import { useActionState } from 'react';
import { signUpAction } from '@/lib/actions/authActions';

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, null);

  return (
    <div className={styles.page}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Join Fables</h1>
        <p className={styles.subtitle}>Create an account to start writing and reading.</p>

        <form action={formAction} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required minLength="3" maxLength="20" />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required minLength="6" />
          </div>

          {state?.error && <p className={styles.errorMsg}>{state.error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={isPending}>
            {isPending ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account? <Link href="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
