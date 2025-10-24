import type { Route } from "./+types/privacy";
import { motion } from "framer-motion";
import { SimpleHeader } from "~/components/ui/SimpleHeader";
import { SimpleFooter } from "~/components/ui/SimpleFooter";
import { Glow } from "~/components/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy Policy - Web to MCP" },
    { name: "description", content: "Privacy Policy for Web to MCP. Learn how we collect, use, and protect your personal information." },
    { name: "keywords", content: "privacy policy, data protection, personal information, web to mcp, privacy" },
    { property: "og:title", content: "Privacy Policy - Web to MCP" },
    { property: "og:description", content: "Privacy Policy for Web to MCP. Learn how we collect, use, and protect your personal information." },
    { property: "og:image", content: "/og.png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/png" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Web to MCP" },
    { property: "og:url", content: "https://web-to-mcp.com/privacy" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Privacy Policy - Web to MCP" },
    { name: "twitter:description", content: "Privacy Policy for Web to MCP. Learn how we collect, use, and protect your personal information." },
    { name: "twitter:image", content: "/og.png" },
  ];
}

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden">
      <Glow />
      
      {/* Additional floating cloud elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large floating cloud */}
        <motion.div
          className="absolute left-[10%] top-[15%] h-32 w-48 rounded-full bg-zinc-800/10 blur-xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Medium cloud */}
        <motion.div
          className="absolute right-[20%] top-[25%] h-24 w-36 rounded-full bg-zinc-700/8 blur-lg"
          animate={{
            x: [0, -15, 0],
            y: [0, 8, 0],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        
        {/* Small cloud */}
        <motion.div
          className="absolute left-[60%] top-[40%] h-16 w-24 rounded-full bg-zinc-600/6 blur-md"
          animate={{
            x: [0, 12, 0],
            y: [0, -5, 0],
            opacity: [0.06, 0.1, 0.06]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8
          }}
        />
      </div>
      
      <SimpleHeader />

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/30 rounded-lg p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-4">
                Privacy Policy
              </h2>
              <p className="text-zinc-400">Last updated on 20/08/25</p>
            </div>

            <div className="prose prose-invert max-w-none space-y-6">
              <div className="space-y-4">
                <p className="text-zinc-300 leading-relaxed">
                  Your privacy is important to us. It is Web to MCP's policy to respect your privacy and comply with any applicable law and regulation regarding any personal information we may collect about you, including across the website and softwares we own and operate.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  Personal information is any information about you which can be used to identify you. This includes information about you as a person (such as name, address, and date of birth), your devices, payment details, and even information about how you use a website or online service.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  In the event our site contains links to third-party sites and services, please be aware that those sites and services have their own privacy policies. After following a link to any third-party content, you should read their posted privacy policy information about how they collect and use personal information. This Privacy Policy does not apply to any of your activities after you leave our site.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  1. Information We Collect
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  Information we collect falls into one of two categories: "<strong className="text-zinc-100">voluntarily provided</strong>" information and "<strong className="text-zinc-100">automatically collected</strong>" information.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  "Voluntarily provided" information refers to any information you knowingly and actively provide us when using or participating in any of our services and promotions.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  "Automatically collected" information refers to any information automatically sent by your devices in the course of accessing our products and services.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  2. Log Data
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your device's Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details about your visit.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  Additionally, if you encounter certain errors while using the site, we may automatically collect data about the error and the circumstances surrounding its occurrence. This data may include technical details about your device, what you were trying to do when the error happened, and other technical information relating to the problem. You may or may not receive notice of such errors, even in the moment they occur, that they have occurred, or what the nature of the error is.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  Please be aware that while this information may not be personally identifying by itself, it may be possible to combine it with other data to personally identify individual persons.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  3. Device Data
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  When you visit our website or interact with our services, we may automatically collect data about your device, such as:
                </p>
                <ul className="list-disc list-inside ml-6 space-y-1 text-zinc-300">
                  <li>Device Type</li>
                  <li>Operating System</li>
                  <li>Unique device identifiers</li>
                  <li>Device settings</li>
                  <li>Geo-location data</li>
                </ul>
                <p className="text-zinc-300 leading-relaxed">
                  Data we collect can depend on the individual settings of your device and software. We recommend checking the policies of your device manufacturer or software provider to learn what information they make available to us.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  4. Personal Information
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  We may ask for personal information — for example, when you submit content to us or when you contact us — which may include one or more of the following:
                </p>
                <ul className="list-disc list-inside ml-6 space-y-1 text-zinc-300">
                  <li>Name</li>
                  <li>Email</li>
                  <li>Social media profiles</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  5. User-Generated Content
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  We consider "user-generated content" to be materials (text, image and/or video content) voluntarily supplied to us by our users for the purpose of publication on our website or re-publishing on our social media channels. All user-generated content is associated with the account or email address used to submit the materials.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  Please be aware that any content you submit for the purpose of publication will be public after posting (and subsequent review or vetting process). Once published, it may be accessible to third parties not covered under this privacy policy.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  6. Legitimate Reasons for Processing Your Personal Information
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  We only collect and use your personal information when we have a legitimate reason for doing so. In which instance, we only collect personal information that is reasonably necessary to provide and improve our services to you.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  7. Collection and Use of Information
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  We may collect personal information from you when you do any of the following on our website:
                </p>
                <ul className="list-disc list-inside ml-6 space-y-1 text-zinc-300">
                  <li>Register for an account</li>
                  <li>Sign up to receive updates from us via email or social media channels</li>
                  <li>Use a mobile device or web browser to access our content</li>
                  <li>Contact us via email, social media, or on any similar technologies</li>
                  <li>When you mention us on social media</li>
                </ul>
                
                <p className="text-zinc-300 leading-relaxed">
                  We may collect, hold, use, and disclose information for the following purposes, and personal information will not be further processed in a manner that is incompatible with these purposes:
                </p>
                <ul className="list-disc list-inside ml-6 space-y-1 text-zinc-300">
                  <li>To provide you with our platform's core features and services</li>
                  <li>To contact and communicate with you for analytics, market research, and business development, including to operate and improve our website, associated applications, and associated social media platforms</li>
                  <li>To enable you to access and use our website, associated applications, and associated social media platforms</li>
                  <li>For internal record keeping and administrative purposes to comply with our legal obligations and resolve any disputes that we may have</li>
                  <li>For security and fraud prevention, and to ensure that our sites and apps are safe, secure, and used in line with our terms of use</li>
                  <li>For technical assessment, including to operate and improve our app, associated applications, and associated social media platforms</li>
                </ul>
                
                <p className="text-zinc-300 leading-relaxed">
                  We may combine voluntarily provided and automatically collected personal information with general information or research data we receive from other trusted sources. For example, our marketing and market research activities may uncover data and insights, which we may combine with information about how visitors use our site to improve our site and your experience on it.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  8. Security of Your Personal Information
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  When we collect and process personal information, and while we retain this information, we will protect it within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  Although we will do our best to protect the personal information you provide to us, we advise that no method of electronic transmission or storage is 100% secure, and no one can guarantee absolute data security.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  You are responsible for selecting any password and its overall security strength, ensuring the security of your own information within the bounds of our services. For example, ensuring any passwords associated with accessing your personal information and accounts are secure and confidential.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  9. How Long We Keep Your Personal Information
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  We keep your personal information only for as long as we need to. This time period may depend on what we are using your information for, in accordance with this privacy policy. For example, if you have provided us with personal information as part of creating an account with us, we may retain this information for the duration your account exists on our system. If your personal information is no longer required for this purpose, we will delete it or make it anonymous by removing all details that identify you.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  However, if necessary, we may retain your personal information for our compliance with a legal, accounting, or reporting obligation or for archiving purposes in the public interest, scientific, or historical research purposes or statistical purposes.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  10. Children's Privacy
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  We do not aim any of our products or services directly at children under the age of 13, and we do not knowingly collect personal information about children under 13.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  11. Disclosure of Personal Information to Third Parties
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  We may disclose personal information to:
                </p>
                <ul className="list-disc list-inside ml-6 space-y-1 text-zinc-300">
                  <li>A parent, subsidiary, or affiliate of our company</li>
                  <li>Third-party service providers for the purpose of enabling them to provide their services, including (without limitation) IT service providers, data storage, hosting and server providers, analytics, error loggers, debt collectors, maintenance or problem-solving providers, marketing providers, professional advisors, and payment systems operators</li>
                  <li>Our employees, contractors, and/or related entities</li>
                  <li>Our existing or potential agents or business partners</li>
                  <li>Credit reporting agencies, courts, tribunals, and regulatory authorities, in the event you fail to pay for goods or services we have provided to you</li>
                  <li>Courts, tribunals, regulatory authorities, and law enforcement officers, as required by law, in connection with any actual or prospective legal proceedings, or in order to establish, exercise, or defend our legal rights</li>
                  <li>Third parties, including agents or sub-contractors, who assist us in providing information, products, services, or direct marketing to you</li>
                  <li>Third parties to collect and process data</li>
                  <li>An entity that buys, or to which we transfer all or substantially all of our assets and business</li>
                </ul>

                <h4 className="text-lg font-semibold text-zinc-100">Third parties we currently use include:</h4>
                <ul className="list-disc list-inside ml-6 space-y-1 text-zinc-300">
                  <li>Google Analytics</li>
                  <li>Mixpanel</li>
                  <li>Sentry</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  12. International Transfers of Personal Information
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  The personal information we collect is stored and/or processed in United States, or where we or our partners, affiliates, and third-party providers maintain facilities.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  The countries to which we store, process, or transfer your personal information may not have the same data protection laws as the country in which you initially provided the information. If we transfer your personal information to third parties in other countries: (i) we will perform those transfers in accordance with the requirements of applicable law; and (ii) we will protect the transferred personal information in accordance with this privacy policy.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  13. Your Rights and Controlling Your Personal Information
                </h3>
                <div className="space-y-3">
                  <p className="text-zinc-300 leading-relaxed">
                    <strong className="text-zinc-100">Your choice:</strong> By providing personal information to us, you understand we will collect, hold, use, and disclose your personal information in accordance with this privacy policy. You do not have to provide personal information to us, however, if you do not, it may affect your use of our website or the products and/or services offered on or through it.
                  </p>
                  
                  <p className="text-zinc-300 leading-relaxed">
                    <strong className="text-zinc-100">Information from third parties:</strong> If we receive personal information about you from a third party, we will protect it as set out in this privacy policy. If you are a third party providing personal information about somebody else, you represent and warrant that you have such person's consent to provide the personal information to us.
                  </p>
                  
                  <p className="text-zinc-300 leading-relaxed">
                    <strong className="text-zinc-100">Marketing permission:</strong> If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by contacting us using the details below.
                  </p>
                  
                  <p className="text-zinc-300 leading-relaxed">
                    <strong className="text-zinc-100">Access:</strong> You may request details of the personal information that we hold about you.
                  </p>
                  
                  <p className="text-zinc-300 leading-relaxed">
                    <strong className="text-zinc-100">Correction:</strong> If you believe that any information we hold about you is inaccurate, out of date, incomplete, irrelevant, or misleading, please contact us using the details provided in this privacy policy. We will take reasonable steps to correct any information found to be inaccurate, incomplete, misleading, or out of date.
                  </p>
                  
                  <p className="text-zinc-300 leading-relaxed">
                    <strong className="text-zinc-100">Non-discrimination:</strong> We will not discriminate against you for exercising any of your rights over your personal information. Unless your personal information is required to provide you with a particular service or offer (for example providing user support), we will not deny you goods or services and/or charge you different prices or rates for goods or services, including through granting discounts or other benefits, or imposing penalties, or provide you with a different level or quality of goods or services.
                  </p>
                  
                  <p className="text-zinc-300 leading-relaxed">
                    <strong className="text-zinc-100">Notification of data breaches:</strong> We will comply with laws applicable to us in respect of any data breach.
                  </p>
                  
                  <p className="text-zinc-300 leading-relaxed">
                    <strong className="text-zinc-100">Complaints:</strong> If you believe that we have breached a relevant data protection law and wish to make a complaint, please contact us using the details below and provide us with full details of the alleged breach. We will promptly investigate your complaint and respond to you, in writing, setting out the outcome of our investigation and the steps we will take to deal with your complaint. You also have the right to contact a regulatory body or data protection authority in relation to your complaint.
                  </p>
                  
                  <p className="text-zinc-300 leading-relaxed">
                    <strong className="text-zinc-100">Unsubscribe:</strong> To unsubscribe from our email database or opt-out of communications (including marketing communications), please contact us using the details provided in this privacy policy, or opt-out using the opt-out facilities provided in the communication. We may need to request specific information from you to help us confirm your identity.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  14. Business Transfers
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  If we or our assets are acquired, or in the unlikely event that we go out of business or enter bankruptcy, we would include data, including your personal information, among the assets transferred to any parties who acquire us. You acknowledge that such transfers may occur, and that any parties who acquire us may, to the extent permitted by applicable law, continue to use your personal information according to this policy, which they will be required to assume as it is the basis for any ownership or use rights we have over such information.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  15. Limits of Our Policy
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and policies of those sites, and cannot accept responsibility or liability for their respective privacy practices.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  16. Changes to This Policy
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  At our discretion, we may change our privacy policy to reflect updates to our business processes, current acceptable practices, or legislative or regulatory changes. If we decide to change this privacy policy, we will post the changes here at the same link by which you are accessing this privacy policy.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  If the changes are significant, or if required by applicable law, we will contact you (based on your selected preferences for communications from us) and all our registered users with the new details and links to the updated or changed policy.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  If required by law, we will get your permission or give you the opportunity to opt in to or opt out of, as applicable, any new uses of your personal information.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  17. Contact Us
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  For any questions or concerns regarding this document, you may contact us via email at <span className="text-zinc-100">team@web-to-mcp.com</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SimpleFooter />
    </div>
  );
} 