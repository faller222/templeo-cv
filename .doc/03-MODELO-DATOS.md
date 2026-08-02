# Modelo de datos Firestore

## `users/{uid}`

```ts
{
  profile: MasterProfile,      // ver src/types.ts
  economy: {
    creditosIa: number,
    ultimaRecarga: number | null  // epoch ms
  },
  createdAt: number,
  updatedAt: number
}
```

`MasterProfile` reutiliza la forma de `CvData` (personalInfo, summary, experience, …) como fuente de verdad.

## `cv_instances/{cvId}`

```ts
{
  userId: string,
  title: string,
  sourceJobHint?: string,
  templateId: string,
  data: CvData,
  theme: CvThemeSettings,
  clonedFrom?: string | null,
  createdAt: number,
  updatedAt: number
}
```

## Reglas

- Un usuario tiene un solo master.
- Muchas instancias CV.
- Clonar = nuevo doc con `clonedFrom` + copia de `data`/`theme`.
- generate-cv lee master + hint y escribe/devuelve `CvData` para una instancia.
