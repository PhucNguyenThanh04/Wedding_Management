import AboutSection from "../../components/About";
import Banner from "../../components/Banner";
import ContactSection from "../../components/ContactSection";
import HallsSection from "../../components/HallSection";
import MenuSection from "../../components/MenuSection";
import ServicesSection from "../../components/ServicesSection";
import TestimonialsSection from "../../components/TestimonialsSection";

function Main() {
  return (
    <main>
      <Banner />
      <AboutSection />
      <HallsSection />
      <MenuSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}

export default Main;
