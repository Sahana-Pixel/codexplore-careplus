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
import { AppointmentFormValidation, getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation";

import { createUser } from "@/lib/actions/patient.actions"
import Image from "next/image"
import { SelectItem } from "../ui/select"
import { Doctors } from "@/constants"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { Appointment } from "@/types/appwrite.types"



export const AppointmentForm =  ({
      userId, patientId,type,appointment,setOpen
  }:{
      
          userId : string;
          patientId: string;
          type :"create" | "cancel"|"schedule"; 
          appointment?:Appointment;
          setOpen?: (open:boolean)=>void;

      
  }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });
 
  
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {

    setIsLoading(true)
    // setErrorMessage(""); // Reset error message on new submission

    let status;
        switch (type) {
          case "schedule":
            status = "scheduled";
            break;
          case "cancel":
            status = "cancelled";
            break;
          default:
            status = "pending";
            break;
        }


    try{
       
      if (type === "create" && patientId) {
                const appointmentData = {
                  userId,
                  patient: patientId,
                  primaryPhysician: values.primaryPhysician,
                  schedule: new Date(values.schedule),
                  reason: values.reason!,
                  status: status as Status,
                  note: values.note,
                };
        
                const appointment = await createAppointment(appointmentData);
                if (appointment) {
                  form.reset();
                  router.push(
                    `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
                }
      }else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    }
        catch (error) {
        console.log(error);
        // setErrorMessage('User creation failed. Please try again.'); // Set error message for UI
      // } finally {
      // Moved to finally to ensure it's executed after try/catch
      }
      setIsLoading(false); 
    };

    let buttonLabel;

        switch (type) {
          case "cancel":
            buttonLabel = "Cancel Appointment";
            break;
          case "create":
            buttonLabel = "Create Appointment";
            break;
            case "schedule":
              buttonLabel = "Schedule Appointment";
              break;  
          default:
           
        }

  
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
   {type === 'create' && <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">Request a new appointment in 10 seconds</p>
    </section>}

    {type !=="cancel" && (
        <>
         <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Doctor"
            placeholder="Select a physician"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt={doctor.name}
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
          
          <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <div
              className={"flex flex-col gap-6 xl:flex-row"}
            >
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual montly check-up"
                
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Notes"
                placeholder="Prefer afternoon appointments, if possible"
                
              />
            </div>
          </>

      )}

      {type === "cancel" && (
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="cancellationReason"
                label="Reason for cancellation"
                placeholder="Urgent meeting came up"
              />
            )}
     
      
     
     
     <SubmitButton isLoading={ isLoading } className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
   >{buttonLabel}</SubmitButton>
 </form>
  </Form>
  )
}



export default AppointmentForm