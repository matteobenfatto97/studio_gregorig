// app/admin/page.tsx (or where your admin page is located)
import Image from "next/image";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/ui/logoutButton"; // Import the client component

export default async function AdminPage() {
  const adminToken = cookies().get("adminToken")?.value;

  if (!adminToken) {
    redirect("/checkAdmin");
  }

  const appointments = await getRecentAppointmentList();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Image
          src="/assets/icons/aa.png"
          height={32}
          width={162}
          alt="logo"
          className="h-8 w-fit"
        />
        <p className="text-16-semibold">Admin Dashboard</p>
        <LogoutButton /> {/* Include the client component */}
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <p className="text-dark-700">
            Inizia la giornata gestendo gli appuntamenti
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Appuntamenti confermati"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Appuntamenti in attesa di conferma"
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
}
