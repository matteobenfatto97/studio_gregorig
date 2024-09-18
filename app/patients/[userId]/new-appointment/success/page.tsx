import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";

const RequestSuccess = async ({
  searchParams,
  params: { userId },
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);

  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment.primaryPhysician
  );

  return (
    <div className=" flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            La sua <span className="text-green-500">richiesta di appuntamento</span> 
            è stata inviata con successo!
          </h2>
          <p> la sua richiesta verrà visionata in pochi minuti</p>
        </section>

        <section className="request-details">
          <p>Dettagli dell'appuntamento: </p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            
              <p className="whitespace-nowrap">{doctor?.name}</p>
            
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> {formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            Nuovo appuntamento
          </Link>
        </Button>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href="/">
            Home
          </Link>
        </Button>

        <p className="copyright">Matteo Benfatto 2024 ® Studio dentistico Dr. Gregorig. Diritti Riservati.</p>
      </div>
    </div>
  );
};

export default RequestSuccess;
