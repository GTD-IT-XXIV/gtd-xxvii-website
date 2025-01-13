import Faq from "./_components/faq/page"
import Background from "./_components/background/page"
import Contact from "./_components/contact/page"

export default function About() {
  return (
    <div className="p-6 m-auto w-[60%]"> 
      <Background/>
      <Faq/>
      <Contact/>
    </div>
  )
}
