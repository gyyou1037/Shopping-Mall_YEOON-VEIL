"use client";

import { useState } from "react";
import { loginAdmin } from "@/app/actions/admin";

export function AdminLoginForm() {
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSending(true);
    setError("");
    const result = await loginAdmin(data);
    setError(result.message);
    setSending(false);
  }

  return (
    <form className="inquiry-form" onSubmit={onSubmit}>
      <label>
        아이디
        <input name="username" type="text" required autoComplete="username" maxLength={40} />
      </label>
      <label>
        비밀번호
        <input name="password" type="password" required autoComplete="current-password" maxLength={100} />
      </label>
      <button className="button dark" type="submit" disabled={sending}>
        {sending ? "확인 중" : "로그인"}
      </button>
      {error ? (
        <p className="form-status error" role="status">
          {error}
        </p>
      ) : null}
    </form>
  );
}
