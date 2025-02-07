import { createClient } from "next-sanity";

const client = createClient({
    projectId: "zjf7u783",
    dataset: "production",
    useCdn: true,
    apiVersion: "2023-10-10"
})

export async function sanityFetch({query, params = {}}: {query: string, params?: {}}){
    return await client.fetch(query, params)
}