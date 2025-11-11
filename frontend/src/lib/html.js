export function htmlToText(html = "") {
  // Browser-safe: prefer DOM; fallback to regex if needed
  if (typeof window !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.replace(/\u00A0/g, " ").trim(); // remove &nbsp;
  }
  return html.replace(/<[^>]*>/g, " ").replace(/\u00A0/g, " ").trim();
}

export function makeExcerpt(text = "", max = 160) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max).trim() + "…" : t;
}
