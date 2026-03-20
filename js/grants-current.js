let grants2026 = [];

async function loadCurrentGrants() {
  const res = await fetch("/content/grants-current.json");
  const data = await res.json();
  grants2026 = data.grants || [];
}