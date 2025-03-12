
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, first_name } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // In a real implementation, you would use an email service like SendGrid, Mailgun, etc.
    // For this example, we'll just log the email that would be sent
    console.log(`Sending welcome email to ${email}`);
    
    // Example of email content
    const emailContent = {
      to: email,
      subject: "Welcome to Food Delivery!",
      text: `Hello ${first_name || "there"},
      
Welcome to Food Delivery! We're excited to have you on board.

You can now enjoy ordering from a variety of restaurants with fast delivery right to your doorstep.

If you have any questions or need assistance, feel free to reply to this email.

Happy ordering!
The Food Delivery Team`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #f97316;">Welcome to Food Delivery!</h2>
  <p>Hello ${first_name || "there"},</p>
  <p>We're excited to have you on board.</p>
  <p>You can now enjoy ordering from a variety of restaurants with fast delivery right to your doorstep.</p>
  <div style="background-color: #f97316; color: white; padding: 12px 20px; text-align: center; border-radius: 4px; margin: 20px 0;">
    <a href="${Deno.env.get("SITE_URL") || "https://your-food-delivery-site.com"}" style="color: white; text-decoration: none; font-weight: bold;">Start Ordering Now</a>
  </div>
  <p>If you have any questions or need assistance, feel free to reply to this email.</p>
  <p>Happy ordering!<br>The Food Delivery Team</p>
</div>`,
    };

    console.log("Email content prepared:", emailContent);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Welcome email would be sent here (simulated for demo)",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in welcome-email function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
