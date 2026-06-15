import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen pb-24 relative overflow-hidden bg-[#faf9f6]">
        <Navbar />
        
        <section className="pt-32 pb-16 px-6 max-w-4xl mx-auto relative z-10">
          <div className="mb-12">
            <h1 className="font-serif font-bold text-5xl md:text-6xl mb-6 tracking-tight text-brand-1">Privacy Policy</h1>
            <p className="font-sans text-lg text-foreground/60">Last Updated: June 2026</p>
          </div>

          <div className="prose prose-lg prose-headings:font-serif prose-headings:text-brand-1 prose-a:text-brand-4 hover:prose-a:text-brand-3 max-w-none text-foreground/80 font-sans leading-relaxed">
            <p>
              At Notrik Technologies ("Notrik", "we", "us", or "our"), we take your privacy seriously. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI study engine.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
            </p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, and contact preferences.</li>
              <li><strong>Study Materials:</strong> Photos of notes, whiteboards, and PDF documents you upload for transformation.</li>
              <li><strong>Payment Data:</strong> We process payments securely via Razorpay (UPI, Cards, Netbanking). We do not store your raw credit card numbers or UPI PINs.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>
              Your study materials are processed strictly to provide the core service (generating flashcards, summaries, and quizzes). 
              <strong> We do NOT use your private, uploaded notes to train public AI models.</strong>
            </p>
            <ul>
              <li>To provide, operate, and maintain our Services.</li>
              <li>To process your transactions and manage your premium subscription.</li>
              <li>To populate your personal, encrypted Trace Drawer.</li>
              <li>To send you administrative information, such as updates, security alerts, and support messages.</li>
            </ul>

            <h2>3. Security of Your Data</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information and uploaded study materials. 
              While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
            </p>

            <h2>4. Data Deletion & Retention</h2>
            <p>
              You have the right to request the deletion of your account and all associated Trace Drawer data at any time. Once requested, your data will be permanently wiped from our active databases within 30 days.
            </p>

            <h2>5. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@notrik.com">privacy@notrik.com</a>.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
