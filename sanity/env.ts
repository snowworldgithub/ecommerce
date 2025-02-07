export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-07'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)
export const token = assertValue(
  "sk4JJe9Nz0QKxbU3UqmbZdUjFuXLPVOaCClCNuUatAhrRI56lxwRHNJ2ZgNSIOx0Ocuzmf0BMz4pgxi5QNkM8irIhs08o2FE0j3Rx08jyUoqzSpEhAerbcMJoxujCkFyDtFDo6ZNDsHhtU6octqbTIIm7YRd7SP1nlaWACuSlfllmH9ERGf1",
  'Missing environment variable: SANITY-API-TOKEN'  

)
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
