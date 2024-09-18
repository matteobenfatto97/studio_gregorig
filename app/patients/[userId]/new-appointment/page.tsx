import Image from "next/image";

import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);

  return (
    <div>
      <Header/>
    <div className="flex h-screen max-h-screen">
      
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">

          <AppointmentForm
            patientId={patient?.$id}
            userId={userId}
            type="create"
          />

        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
      
    </div>
    <Footer/>
    </div>
  );
};

export default Appointment;
