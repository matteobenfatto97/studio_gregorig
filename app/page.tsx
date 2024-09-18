import Image from "next/image";
import Link from "next/link";
import { PasskeyModal } from "@/components/PasskeyModal";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import ReviewList from "@/components/lists/ReviewList";
import ServicesList from "@/components/lists/ServicesSection";
import LiveChat from "@/components/Chatbot";
import Hero from "@/components/ui/hero";
import ServicesSection from "@/components/lists/ServicesSection";
import CallUsBanner from "@/components/ui/callUs";

const HomePage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-black-300 flex flex-col items-center">
        {/* Hero Section */}
        <Hero />
        {/* Services Section */}
        <ServicesSection />
        {/* Call Us banner Section */}
        <CallUsBanner />
        {/* Testimonials Section */}
        <ReviewList />

        {/* Chatbot Section */}
        <LiveChat />

        <Link href="/checkAdmin" className="text-dark-300 hover:text-green-500">
          Admin
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
