import type { FormEvent } from "react";
import { useState } from "react";

import { useSignup } from "../hooks";
import type { UserRole } from "../types";

function getErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

export function RegisterForm(props: { onSuccess?: () => void }) {
  const signupMutation = useSignup();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("AGENT");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await signupMutation.mutateAsync({ name, email, password, role });
    props.onSuccess?.();
  }

  return (
    <form onSubmit={onSubmit} className="form">
      <label className="form-field">
        <span className="text-muted" style={{ fontWeight: 700 }}>
          Name
        </span>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
          autoComplete="name"
          required
        />
      </label>

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
          autoComplete="new-password"
          required
        />
      </label>

      <label className="form-field">
        <span className="text-muted" style={{ fontWeight: 700 }}>
          Role
        </span>
        <select
          className="input"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <option value="ADMIN">Admin</option>
          <option value="AGENT">Agent</option>
        </select>
      </label>

      <button
        className="btn btn--primary"
        type="submit"
        disabled={signupMutation.isPending}
      >
        {signupMutation.isPending ? "Creating account..." : "Register"}
      </button>

      {signupMutation.isError ? (
        <div className="form-error">{getErrorMessage(signupMutation.error)}</div>
      ) : null}
    </form>
  );
}
