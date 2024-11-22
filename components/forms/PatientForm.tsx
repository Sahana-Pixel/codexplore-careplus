"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
// import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
import CustomFormField, { FormFieldType } from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation";

import { createUser } from "@/lib/actions/patient.actions"
import { log } from "console"



export const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState(""); // State for error message



  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });
 
  
  async function onSubmit({name,email,phone}: z.infer<typeof UserFormValidation>) {
    console.log("onSubmit, name: " + name)
    setIsLoading(true)
    // setErrorMessage(""); // Reset error message on new submission

    try{
       const userData ={name,email,phone}
       const user =await createUser(userData)
      console.log("user created successfully");
      
       if(user)
        console.log(user)
         router.push(`/patients/${user.$id}/register`)
       } catch (error) {
        console.log(error);
        // setErrorMessage('User creation failed. Please try again.'); // Set error message for UI
      // } finally {
      //   setIsLoading(false); // Moved to finally to ensure it's executed after try/catch
      }
    };

  
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
    <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
    </section>

    <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="john"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(555) 123-4567"
        />
      
     
     
      <SubmitButton isLoading={ isLoading }>Get Started</SubmitButton>
    </form>
  </Form>
  )
}


export default PatientForm
