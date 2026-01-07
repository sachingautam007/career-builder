import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { features } from "@/WebData/features";
import { Card, CardContent } from "@/components/ui/card";
import { Working } from "@/WebData/Working";
import { faqs } from "@/WebData/faqs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";
export default function Home() {
  return (
    <div>
     <div className="grid-background"></div>
      <HeroSection/>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
         <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 gradient-sp">Valuable Features for your Career</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            return (
              <Card key={index}
              className="border-2 hover:border-primary transition-colors duration-300">
     <CardContent className="pt-6 text-center flex-col items-center">
       <div className="flex flex-col items-center justify-center">{feature.icon}
          <h3 className="text-xl font-bold mb-2 gradient-ti">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.description}</p>
       </div>
     </CardContent>
       </Card>
       );
      })}
       </div>
        </div>
      </section>

      

      <section className="w-full py-12 md:py-18 lg:py-26 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
         <h2 className="text-3xl font-bold tracking-tighter text-center mb-10 gradient-sp">How it Works</h2>
         <p className="text-muted-foreground">Four Simple Steps to Transform Your Career</p>
           </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {Working.map((item, index) => {
            return (
              <div key={index}
              className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 hover:border-primary transition-colors duration-300">{item.icon}</div>
                <h3 className="font-semibold text-4xl gradient-sac">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
      );
      })}
          
         </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-18 bg-muted/10">
        <div className="container mx-auto px-4 md:px-6">       
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-4xl font-bold">70+</h3>
            <p className="text-muted-foreground">Industries Covered</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-4xl font-bold">1000+</h3>
            <p className="text-muted-foreground">Interview Questions</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-4xl font-bold">92+</h3>
            <p className="text-muted-foreground">Success Rate</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-4xl font-bold">24/7</h3>
            <p className="text-muted-foreground">Support Available</p>
          </div>
         </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-18 lg:py-26 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
         <h2 className="text-3xl font-bold tracking-tighter text-center mb-10 gradient-sp">Most Frequently ask Question</h2>
         <p className="text-muted-foreground">Click to see the answers of FAQ's</p>
           </div>
         <div className="max-w-6xl mx-auto">
           <Accordion type="single" collapsible>
          {faqs.map((faqs, index) => {
            return (
              <div key={index}>
  <AccordionItem key={index} value={`item-${index}`}>
    <AccordionTrigger>{faqs.question}</AccordionTrigger>
    <AccordionContent>
    {faqs.answer}
    </AccordionContent>
  </AccordionItem>
         </div>     
      );
    })}
    </Accordion>
          
         </div>
        </div>
      </section>

  <section className="w-full">
        <div className="mx-auto py-24 gradient rounded-lg">
          <div className="text-center max-w-3xl mx-auto mb-12">
         <h2 className="text-3xl font-bold tracking-tighter text-center mb-10 gradient-sp">Let accelerate your career</h2>
         <p className="text-neutral-100">Join thousands of students 
          who are growing their career with career-mentor guidance</p>
          <Link href="/industry-insights" passHref>
          <Button
          size="lg"
          variant="secondary"
          className="h-11 mt-5 animate-bounce 
          bg-background hover:bg-purple-600 text-cyan-700 hover:text-white transition-colors duration-300"
          >
            Start Now <ArrowBigRight className="ml-2 h-4 w-4"/>
          </Button>
          </Link> 
           </div>
        </div>
      </section>

     </div>
  );
}
