"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";

import { AppointmentModal } from "../AppointmentModal";
import { StatusBadge } from "../StatusBadge";

const statusLabels: Record<string, { display: string; value: Status }> = {
  scheduled: { display: "Confermato", value: "scheduled" },
  pending: { display: "In Attesa", value: "pending" },
  cancelled: { display: "Annullato", value: "cancelled" },
};

export const columns: ColumnDef<Appointment>[] = [
  {
    id: "index",
    header: () => <div className="text-center">#</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <p className="text-14-medium">{row.index + 1}</p>
      </div>
    ),
  },
  {
    accessorKey: "patient",
    header: () => <div className="text-center">Paziente</div>,
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="text-center">
          <p className="text-14-medium">{appointment.patient.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const appointment = row.original;
      const statusInfo = statusLabels[appointment.status] || {
        display: appointment.status,
        value: appointment.status,
      }; // Fallback to original status if not found

      return (
        <div className="flex justify-center min-w-[115px]">
          <StatusBadge status={appointment.status} label={statusInfo.display} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: () => <div className="text-center">Appuntamento</div>,
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="text-center min-w-[100px]">
          <p className="text-14-regular">
            {formatDateTime(appointment.schedule).dateTime}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: () => <div className="text-center">Medico</div>,
    cell: ({ row }) => {
      const appointment = row.original;
      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );

      return (
        <div className="flex items-center justify-center gap-3">
          <Image
            src={doctor?.image!}
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">{doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center pl-4">Azioni</div>,
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="flex justify-center gap-1">
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="schedule"
            label="conferma"
            title="Conferma Appuntamento"
            description="Per cortesia approva le seguenti modifiche per confermare la prenotazione."
          />
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="cancel"
            label="annulla"
            title="Cancella appuntamento"
            description="Sicuro di voler cancellare l'appuntamento?"
          />
        </div>
      );
    },
  },
];
