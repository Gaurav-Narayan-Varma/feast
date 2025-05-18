import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ChefConsoleQA() {
  const faqs = [
    {
      question: "How do I update my menu?",
      answer:
        "You can update your menu by navigating to the 'My Menu' section in the sidebar. From there, you can add new dishes, edit existing ones, or remove items that are no longer available. The order of your menu will be reflected what customers see!",
    },
    {
      question: "How do I set my availability?",
      answer:
        "Go to the 'My Availability' section to set your regular working hours and mark any dates when you're unavailable. This helps clients book your services when you're available to work.",
    },
    {
      question: "How are payments processed?",
      answer:
        "Payments are processed securely through our platform. Once a client makes a booking, the payment is held in escrow and released to you after the event is completed successfully.",
    },
    {
      question: "Can I cancel a booking?",
      answer:
        "Yes, but we encourage you to honor your commitments. Cancellations may affect your rating. If you need to cancel, please do so at least 1-2 days in advance and contact us directly to explain the situation.",
    },
    {
      question: "How do I contact support?",
      answer:
        "For any questions or issues not covered in the FAQ, please email feast-team@joinfeastco.com. We're available 24/7 to assist you.",
    },
  ];

  return (
    <>
      <div className="section-title">Help & Support</div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Find answers to common questions about using the chef platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
          <CardDescription>
            Contact our support team for personalized assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Our support team is available 24/7 to help you with any questions or
            issues you may have.
          </p>
          <div className="flex flex-col space-y-2">
            <p>
              <strong>Email:</strong> feast-team@joinfeastco.com
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
