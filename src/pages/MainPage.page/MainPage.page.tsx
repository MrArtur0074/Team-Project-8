import Template from "../../components/general/Template.comp";
import Aboutus from "../../components/mainPage/Aboutus.comp/Aboutus.comp";
import Analise from "../../components/mainPage/Analise.comp/Analise.comp";
import Banner from "../../components/mainPage/Banner.comp/Banner.comp";
import HowUse from "../../components/mainPage/HowUse/HowUse.comp";
import "./MainPage.page.css";

export default function MainPage() {
  return (
    <>
      <Template>
        <div className="container_wrapper">
          <Banner />
        </div>
        <HowUse />
        <div className="container_wrapper">
          <Analise />
          <Aboutus />
        </div>
      </Template>
    </>
  );
}
