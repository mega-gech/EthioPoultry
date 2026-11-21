import { useEffect, useState } from "react";
import { getAdminSettings, updateAdminSettings, type AdminSettings as SettingsData } from "../../services/adminService";
import { ErrorState, LoadingState } from "./AdminOverview";

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    let active = true;
    getAdminSettings()
      .then((result) => {
        if (active) setSettings(result);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Unable to load settings.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateAccount = (key: keyof SettingsData["account"], value: string) => {
    setSettings((current) =>
      current ? { ...current, account: { ...current.account, [key]: value } } : current
    );
  };
  const updatePlatform = (
    key: keyof SettingsData["platform"],
    value: string
  ) => {
    setSettings((current) =>
      current ? { ...current, platform: { ...current.platform, [key]: value } } : current
    );
  };
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage("");
    try {
      const updated = await updateAdminSettings({
        account: settings.account,
        platform: settings.platform,
        ...(newPassword
          ? { currentPassword, newPassword }
          : {}),
      });
      setSettings(updated);
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Settings saved successfully.");
      setIsError(false);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Unable to save settings.");
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState message="Loading admin settings..." />;
  if (error || !settings) return <ErrorState message={error || "No settings available."} />;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Admin settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your administrator account, platform contact details, and password.
        </p>
      </div>
      <form onSubmit={save} className="space-y-5">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-gray-900">Administrator account</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SettingsField label="Full name" value={settings.account.name} onChange={(v) => updateAccount("name", v)} required />
            <SettingsField label="Email address" type="email" value={settings.account.email} onChange={(v) => updateAccount("email", v)} required />
            <SettingsField label="Phone number" value={settings.account.phone} onChange={(v) => updateAccount("phone", v)} />
            <SettingsField label="Location" value={settings.account.location} onChange={(v) => updateAccount("location", v)} />
          </div>
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-gray-900">Platform configuration</h2>
          <p className="mt-1 text-sm text-gray-500">
            Basic display and support contact information.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SettingsField label="Platform name" value={settings.platform.platformName} onChange={(v) => updatePlatform("platformName", v)} required />
            <SettingsField label="Support email" type="email" value={settings.platform.supportEmail} onChange={(v) => updatePlatform("supportEmail", v)} />
          </div>
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-gray-900">Account security</h2>
          <p className="mt-1 text-sm text-gray-500">
            Leave these fields blank to keep your current password.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SettingsField
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
              autoComplete="current-password"
            />
            <SettingsField
              label="New password (at least 8 characters)"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
              minLength={newPassword ? 8 : undefined}
            />
          </div>
        </section>
        {message && (
          <div
            role={isError ? "alert" : "status"}
            className={`rounded-lg border px-4 py-3 text-sm ${
              isError
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {message}
          </div>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

function SettingsField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
}) {
  return (
    <label className="text-sm font-medium text-gray-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        autoComplete={autoComplete}
        minLength={minLength}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );
}
