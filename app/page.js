import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Link from "next/link";


export default function Home() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Footer/>
      {/* <div className="flex items-center justify-center min-h-screen flex-col">
      <h2 className="text-3xl mb-4">
        G6 Inventory Management System
      </h2>
      <Link href="/dashboard/home/overview/">Go to HomePage </Link>

    </div> */}
    </div>
  );
}
