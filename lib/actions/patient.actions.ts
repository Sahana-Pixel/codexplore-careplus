'use server';

import { ID, Query } from "node-appwrite";
import { storage, users,databases, ENDPOINT, BUCKET_ID, DATABASE_ID, PATIENT_COLLECTION_ID,PROJECT_ID } from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";

export const createUser = async (user: CreateUserParams) => {
    try{
         // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await users.create(
        ID.unique(),
        user.email,
        user.phone,
        undefined,
        user.name
      );
      console.log(ID.unique());
      console.log(newuser)
  
      return parseStringify(newuser)

    }catch(error:any){
        if (error && error?.code === 409) {
            const existingUser = await users.list([
              Query.equal("email", [user.email]),
            ]);
      
            return existingUser.users[0];
          }else {
            //` Log unexpected errors
            console.error('Error creating user:', error);
            throw error; //` Rethrow or handle as necessary
          }
    }

}

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};


export const getPatient = async (userId: string) => {
  console.log("DATABASE_ID:", DATABASE_ID);
console.log("PATIENT_COLLECTION_ID:", PATIENT_COLLECTION_ID);
console.log("Query Condition:", [Query.equal("userId", userId)]);
console.log("User ID type:", typeof userId);

  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal('userId',userId)]
      
    )
    console.log(patients);
    console.log("Received patient data:", patients.documents);

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// export const getPatient = async (userId: string) => {
//   console.log("Getting patient for userId:", userId);
//   console.log("DATABASE_ID:", DATABASE_ID);
//   console.log("PATIENT_COLLECTION_ID:", PATIENT_COLLECTION_ID);
//   console.log("Querying userId:", userId);
  

//   try {
//       const patients = await databases.listDocuments(
//           DATABASE_ID!,
//           PATIENT_COLLECTION_ID!,
//           [Query.equal('userId', userId)]
//       );
     

//       console.log("Fetched patients:", patients);

//       if (patients.total === 0) {
//           console.error("No patient found for userId:", userId);
//           return null;
//       }

//       // Example: Select the latest document based on the 'Updated' field
//       const sortedPatients = patients.documents.sort(
//           (a, b) => new Date(b.$updatedAt).getTime() - new Date(a.$updatedAt).getTime()
//       );

//       const latestPatient = sortedPatients[0]; // Select the most recent document
//       console.log("Latest patient:", latestPatient);

//       return parseStringify(latestPatient);
//   } catch (error) {
//       console.error("An error occurred while retrieving the user details:", error);
//       return null;
//   }
// };

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      const inputFile =InputFile.fromBuffer(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );
        
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
      console.log(BUCKET_ID)
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl:  `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
      console.log(error)
  }
};
