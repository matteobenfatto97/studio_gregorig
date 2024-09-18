import Image from "next/image";
import { redirect } from "next/navigation";

import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser } from "@/lib/actions/patient.actions";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);
  const patient = await getPatient(userId);

  if (patient) redirect(`/patients/${userId}/new-appointment`);

  return (
    <div>
    <Header/>
    <div className="flex h-screen max-h-screen">
      

      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">

          <RegisterForm user={user} />
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="register"
        className="side-img max-w-[390px]"
      />
      
    </div>
    <Footer/>
    </div>
  );
};

export default Register;
