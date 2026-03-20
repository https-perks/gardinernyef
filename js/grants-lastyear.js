let grants2025 = [];

async function loadLastYearGrants() {
  const res = await fetch("/content/grants-lastyear.json");
  const data = await res.json();
  grants2025 = data.grants || [];
}