import type { FormEvent } from "react";
import { useState } from "react";

import { useLogin } from "../hooks";
import toast from "react-hot-toast";



export function LoginForm(props: { onSuccess?: () => void }) {
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({ email, password });
      props.onSuccess?.();
      
    } catch (error) {
      toast.error( "Login failed");
    }

  }

  return (
    <form onSubmit={onSubmit} className="form">
      <label className="form-field">
        <span className="text-muted" style={{ fontWeight: 700 }}>
          Email
        </span>
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </label>

      <label className="form-field">
        <span className="text-muted" style={{ fontWeight: 700 }}>
          Password
        </span>
        <input
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      <button className="btn btn--primary" type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>


    </form>
  );
}
