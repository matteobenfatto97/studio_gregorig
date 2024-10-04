"use client";

import Image from "next/image";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/ui/logoutButton";

// Define the type for your appointment data
interface AppointmentData {
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
  documents: any[]; // You can replace 'any' with a more specific type based on your data structure
}

const AdminPage = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentData | null>(
    null
  ); // Specify the type for appointments
  const [loading, setLoading] = useState(true); // State for loading

  // Check if the admin is logged in
  useEffect(() => {
    const isAdminLoggedIn = window.localStorage.getItem("isAdminLoggedIn");
    if (!isAdminLoggedIn) {
      router.push("/"); // Redirect to Home if not logged in
    }
  }, [router]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data: AppointmentData = await getRecentAppointmentList(); // Type assertion for fetched data
        setAppointments(data); // Set the appointments state
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAppointments(); // Call the fetch function
  }, []);

  // Loading state
  if (loading) {
    return <div>Loading...</div>; // Show a loading message while fetching
  }

  if (!appointments) {
    return <div>No appointments found.</div>; // Handle case where there are no appointments
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-12 ">
      <header className="admin-header flex items-center space-x-4 py-2">
        <Image
          src="/assets/icons/aa.png"
          height={120} // Increased height for a bigger logo
          width={240} // Increased width for a bigger logo
          alt="logo"
          className="h-auto w-auto" // Maintain aspect ratio
        />
        <p className="text-20-semibold text-white leading-tight">
          Admin Dashboard
        </p>{" "}
        <LogoutButton />
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header text-white">Benvenuto</h1>
          <p className="text-dark-700">inizia a gestire i nuovi appuntamenti</p>
        </section>

        <section className="admin-stat text-white">
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Appuntamenti confermati"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Appuntamenti in attesa"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Appuntamenti cancellati"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>

        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  );
};

export default AdminPage;
