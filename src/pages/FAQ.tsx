
import React from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';

const FAQ = () => {
  const { t } = useLanguage();
  
  const faqData = {
    ordering: [
      {
        question: "How do I place an order?",
        answer: "Browse restaurants, select items you want, add them to your cart, and proceed to checkout. You'll need to provide delivery details and payment information to complete your order."
      },
      {
        question: "Can I modify my order after it's placed?",
        answer: "Once an order is confirmed, modifications are limited. Contact the restaurant directly through our app as soon as possible, and they'll try to accommodate your request if the order hasn't been prepared yet."
      },
      {
        question: "Is there a minimum order amount?",
        answer: "Minimum order amounts vary by restaurant. You can see the minimum order requirement on each restaurant's page before placing your order."
      },
      {
        question: "How do I know my order was received?",
        answer: "You'll receive an immediate confirmation email and app notification once your order is successfully placed. You can also check your order status in the 'Orders' section of your account."
      },
      {
        question: "Can I schedule an order for later?",
        answer: "Yes, during checkout you can choose to have your food delivered immediately or schedule it for a later time on the same day or up to a week in advance."
      }
    ],
    payment: [
      {
        question: "What payment methods are accepted?",
        answer: "We accept all major credit and debit cards, PayPal, and in some areas, cash on delivery. Payment options may vary slightly based on your location."
      },
      {
        question: "Is it safe to save my payment information?",
        answer: "Yes, we use industry-standard encryption and security protocols to protect your payment information. Your card details are never stored directly on our servers."
      },
      {
        question: "How do refunds work?",
        answer: "If there's an issue with your order, you can request a refund through the app or website. Refunds typically process within 5-7 business days, depending on your payment method and financial institution."
      },
      {
        question: "Will I get a receipt for my order?",
        answer: "Yes, a receipt is automatically emailed to you after your order is completed. You can also find all your order receipts in the 'Orders' section of your account."
      },
      {
        question: "Are there any hidden fees?",
        answer: "We're transparent about costs. You'll see the item price, tax, delivery fee, and any applicable service fees clearly displayed before you confirm your order."
      }
    ],
    delivery: [
      {
        question: "How long will my delivery take?",
        answer: "Estimated delivery times are shown when you place your order and depend on factors like distance, time of day, and restaurant preparation time. You can track your order in real-time through our app."
      },
      {
        question: "How do I track my order?",
        answer: "Once your order is confirmed, you can track its status in real-time through the 'Orders' section. You'll see updates as your food is prepared, picked up, and on its way to you."
      },
      {
        question: "What if my food arrives late or cold?",
        answer: "If your order doesn't meet your expectations, please report the issue through our app within 24 hours of delivery. We'll work with you to make it right, which may include a refund or credit for a future order."
      },
      {
        question: "Can I tip my delivery person?",
        answer: "Yes, you can add a tip during checkout or after delivery through the app. 100% of your tip goes directly to the delivery person."
      },
      {
        question: "Are there areas you don't deliver to?",
        answer: "Delivery availability depends on restaurant partners in your area. Enter your address to see which restaurants deliver to your location."
      }
    ],
    dietary: [
      {
        question: "How can I find restaurants that match my dietary preferences?",
        answer: "You can use our dietary filters (vegetarian, vegan, non-vegetarian) to find restaurants and dishes that match your preferences. These filters are available on the restaurants listing page."
      },
      {
        question: "Are nutritional information details available for menu items?",
        answer: "Yes, many menu items include detailed nutritional information including calories, protein, carbs, fat, and fiber content. This information is displayed on the food item details page."
      },
      {
        question: "How do I know if a restaurant offers vegetarian or vegan options?",
        answer: "Restaurants with vegetarian or vegan options are clearly marked with dietary indicators. You can also use our dietary filters to show only restaurants that offer these options."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Find quick answers to common questions about our food delivery service</p>
        </div>
        
        <Tabs defaultValue="ordering" className="w-full">
          <TabsList className="w-full mb-8 flex justify-center bg-transparent h-auto p-0 space-x-2">
            <TabsTrigger 
              value="ordering" 
              className="px-6 py-2 rounded-full data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Ordering
            </TabsTrigger>
            <TabsTrigger 
              value="payment" 
              className="px-6 py-2 rounded-full data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Payment
            </TabsTrigger>
            <TabsTrigger 
              value="delivery" 
              className="px-6 py-2 rounded-full data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Delivery
            </TabsTrigger>
            <TabsTrigger 
              value="dietary" 
              className="px-6 py-2 rounded-full data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Dietary Options
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ordering" className="shadow-lg rounded-lg bg-white p-6 dark:bg-gray-800">
            <Accordion type="single" collapsible className="w-full">
              {faqData.ordering.map((item, index) => (
                <AccordionItem key={index} value={`ordering-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="payment" className="shadow-lg rounded-lg bg-white p-6 dark:bg-gray-800">
            <Accordion type="single" collapsible className="w-full">
              {faqData.payment.map((item, index) => (
                <AccordionItem key={index} value={`payment-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="delivery" className="shadow-lg rounded-lg bg-white p-6 dark:bg-gray-800">
            <Accordion type="single" collapsible className="w-full">
              {faqData.delivery.map((item, index) => (
                <AccordionItem key={index} value={`delivery-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="dietary" className="shadow-lg rounded-lg bg-white p-6 dark:bg-gray-800">
            <Accordion type="single" collapsible className="w-full">
              {faqData.dietary.map((item, index) => (
                <AccordionItem key={index} value={`dietary-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 text-center p-6 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
          <h3 className="font-medium mb-2">Still have questions?</h3>
          <p className="mb-4 text-muted-foreground">Our support team is here to help you</p>
          <a 
            href="mailto:support@foodie.com" 
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
