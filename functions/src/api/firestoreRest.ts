/**
 * Firestore REST helpers using the caller's ID token (no Admin SDK).
 */

function projectId() {
  return (
    process.env.VITE_FIREBASE_PROJECT_ID ||
    process.env.GCLOUD_PROJECT ||
    process.env.FIREBASE_PROJECT_ID ||
    "templeo-cv"
  );
}

function docUrl(path: string) {
  const encoded = path
    .split("/")
    .map(encodeURIComponent)
    .join("/");
  return `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents/${encoded}`;
}

function fromFirestoreValue(value: any): any {
  if (value == null) return null;
  if ("nullValue" in value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("arrayValue" in value) {
    return (value.arrayValue.values || []).map(fromFirestoreValue);
  }
  if ("mapValue" in value) {
    const fields = value.mapValue.fields || {};
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(fields)) {
      out[k] = fromFirestoreValue(v);
    }
    return out;
  }
  return null;
}

function toFirestoreValue(value: any): any {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === "object") {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

export function fieldsToObject(fields: Record<string, any> = {}) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(fields)) {
    out[k] = fromFirestoreValue(v);
  }
  return out;
}

export function objectToFields(obj: Record<string, any>) {
  const fields: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    fields[k] = toFirestoreValue(v);
  }
  return fields;
}

export async function getDocument(path: string, idToken: string) {
  const res = await fetch(docUrl(path), {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore GET ${path}: ${res.status} ${text}`);
  }
  const json = await res.json();
  return fieldsToObject(json.fields);
}

export async function setDocument(
  path: string,
  data: Record<string, any>,
  idToken: string
) {
  const res = await fetch(docUrl(path), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: objectToFields(data) }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore PATCH ${path}: ${res.status} ${text}`);
  }
  return fieldsToObject((await res.json()).fields);
}

export async function createDocument(
  collection: string,
  data: Record<string, any>,
  idToken: string,
  documentId?: string
) {
  const base = `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents/${encodeURIComponent(collection)}`;
  const url = documentId
    ? `${base}?documentId=${encodeURIComponent(documentId)}`
    : base;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: objectToFields(data) }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore POST ${collection}: ${res.status} ${text}`);
  }
  const json = await res.json();
  const name: string = json.name || "";
  const id = name.split("/").pop() || documentId || "";
  return { id, data: fieldsToObject(json.fields) };
}

export async function listDocuments(
  collection: string,
  idToken: string,
  fieldFilter?: { field: string; value: string }
) {
  // Prefer structured query when filtering by userId
  if (fieldFilter) {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents:runQuery`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: collection }],
          where: {
            fieldFilter: {
              field: { fieldPath: fieldFilter.field },
              op: "EQUAL",
              value: { stringValue: fieldFilter.value },
            },
          },
        },
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Firestore query ${collection}: ${res.status} ${text}`);
    }
    const rows = await res.json();
    return (Array.isArray(rows) ? rows : [])
      .filter((r: any) => r.document)
      .map((r: any) => {
        const name: string = r.document.name;
        const id = name.split("/").pop()!;
        return { id, ...fieldsToObject(r.document.fields) };
      });
  }

  const res = await fetch(docUrl(collection), {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore list ${collection}: ${res.status} ${text}`);
  }
  const json = await res.json();
  return (json.documents || []).map((doc: any) => {
    const id = (doc.name as string).split("/").pop()!;
    return { id, ...fieldsToObject(doc.fields) };
  });
}
