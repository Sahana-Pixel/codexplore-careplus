// import * as sdk from "node-appwrite";

// console.log(process.env);

// export const {
//   NEXT_PUBLIC_ENDPOINT: ENDPOINT,
//   PROJECT_ID,
//   API_KEY,
//   DATABASE_ID,
//   PATIENT_COLLECTION_ID,
//   DOCTOR_COLLECTION_ID,
//   APPOINTMENT_COLLECTION_ID,
//   NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
// } = process.env;

// console.log("Appwrite Endpoint:", ENDPOINT);



// const client = new sdk.Client();

// client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);

// console.log({ ENDPOINT });

// export const databases = new sdk.Databases(client);
// export const users = new sdk.Users(client);
// export const messaging = new sdk.Messaging(client);
// export const storage = new sdk.Storage(client);

import * as sdk from "node-appwrite";

// Hardcoded values for the Appwrite configuration
export const ENDPOINT = 'https://cloud.appwrite.io/v1';
export const PROJECT_ID = '670a7a1f000220e2bf10';
export const API_KEY = 'standard_6ecb12b633fa71210c6dae4d6ea5ad14042b7ab08ea428cab36be3752ed6423d52cd7b015b9ba6cd11437cba2f9612a9cb30a836199688534916b506d2b905e052b2e5d1f897ac5b6dc681f2aa6895de17989897275d7c104701f57f03434fa9152f45d81220fe842123d653c02196fffe07119f47a1979ef3f8bde1a3ca96df';
export const DATABASE_ID = '670a827e00134b32d17b';
export const PATIENT_COLLECTION_ID = '670a82d2000a9a80c3fc';
export const DOCTOR_COLLECTION_ID = '670a83b30023217a4e15';
export const APPOINTMENT_COLLECTION_ID = '670a84a10011b47260d3';
export const BUCKET_ID = '670a866f0028e4b380cd';
export const NEXT_PUBLIC_ADMIN_PASSKEY= '123456';
// export const NEXT_PUBLIC_ADMIN_PASSKEY= 123456
console.log("Appwrite Endpoint:", ENDPOINT);

const client = new sdk.Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);

console.log({ ENDPOINT });

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);
