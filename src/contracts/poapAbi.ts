// Fetch ABI at runtime from public path if available. Place gitarch_poap.json in /public or project root served path.
export const getPoapAbi = async (): Promise<any | null> => {
  try {
    const res = await fetch('/gitarch_poap.json');
    if (!res.ok) return null;
    return await res.json();
  } catch (_e) {
    return null;
  }
};

