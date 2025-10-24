import type { Route } from "./+types/terms";
import { motion } from "framer-motion";
import { SimpleHeader } from "~/components/ui/SimpleHeader";
import { SimpleFooter } from "~/components/ui/SimpleFooter";
import { Glow } from "~/components/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Terms of Use - Web to MCP" },
    { name: "description", content: "Terms of Use for Web to MCP. Read our terms and conditions for using our website and services." },
    { name: "keywords", content: "terms of use, terms and conditions, web to mcp, legal, agreement" },
    { property: "og:title", content: "Terms of Use - Web to MCP" },
    { property: "og:description", content: "Terms of Use for Web to MCP. Read our terms and conditions for using our website and services." },
    { property: "og:image", content: "/og.png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/png" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Web to MCP" },
    { property: "og:url", content: "https://web-to-mcp.com/terms" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Terms of Use - Web to MCP" },
    { name: "twitter:description", content: "Terms of Use for Web to MCP. Read our terms and conditions for using our website and services." },
    { name: "twitter:image", content: "/og.png" },
  ];
}

export default function Terms() {
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
                Terms of Use
              </h2>
              <p className="text-zinc-400">Last updated on 20/08/25</p>
            </div>

            <div className="prose prose-invert max-w-none space-y-6">
              <div className="space-y-4">
                <p className="text-zinc-300 leading-relaxed">
                  1. These Website Terms of Service ("<strong className="text-zinc-100">Terms</strong>") govern the use of our website and any related Web to MCP software (the "<strong className="text-zinc-100">Software</strong>") or services (collectively, the "<strong className="text-zinc-100">Services</strong>") provided by our company and its subsidiaries, representatives and affiliates (collectively, "<strong className="text-zinc-100">Web to MCP</strong>", "<strong className="text-zinc-100">we</strong>", "<strong className="text-zinc-100">us</strong>" or "<strong className="text-zinc-100">our</strong>") regardless of whether you, the customer or user, is a paid user or a non-paying visitor. These Terms, and any other terms and policies referred to in these Terms, form an Agreement between Web to MCP and the user (referred to as "<strong className="text-zinc-100">Customer</strong>" or "<strong className="text-zinc-100">you</strong>"), collectively referred to as the Parties or each a Party. These Terms govern your use and access to our Services, including our Website and/or Software, our notifications and any materials or content appearing therein.
                </p>
                <p className="text-zinc-300 leading-relaxed">
                  Please also read our Privacy Policy, which explains how we collect and use your personal information, our Acceptable Use Policy and Cookie Policy, which outline your responsibilities when using our Website and Services. These Terms are relevant for those wishing to use Web to MCP's Website and/or create an account and utilise the Services provided by Web to MCP.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  1. About Us and our Services
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                  <li>We are a company registered in India.</li>
                  <li>Web to MCP is a tool that helps developers convert websites into MCP (Model Context Protocol) compatible format, enabling seamless integration with AI development environments and tools.</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  2. Acceptance
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                  <li>Web to MCP owns, or holds the relevant rights to the Website and/or Software and will grant a non-exclusive license to the Customer, per the terms of this Agreement, and allow the use of the Website and/or Software.</li>
                  <li>This Agreement sets out the terms upon which Web to MCP has agreed to grant a license to the Customer to use the Website and Software. This Agreement is binding on any use of the Website and Software and applies to the Customer from the time that Web to MCP provides the Customer with an account ("<strong className="text-zinc-100">Customer's account</strong>") to access and use the Website and/or Software ("<strong className="text-zinc-100">Effective Date</strong>").</li>
                  <li>By accessing and/or using the Website and/or Software you:
                    <ol className="list-decimal list-inside ml-6 mt-2 space-y-1 text-zinc-300">
                      <li>warrant to us that you have reviewed this Agreement, including our Website Terms of Use (available on the Site) and our Privacy Policy (available on the Site), with your parent or legal guardian (if you are under 18 years of age), and you understand it;</li>
                      <li>warrant to us that you have the legal capacity to enter into a legally binding agreement with us or (if you are under 18 years of age) you have your parent's or legal guardian's permission to access and use the Site and they have agreed to the Terms on your behalf; and</li>
                      <li>agree to use the Services in accordance with this Agreement.</li>
                    </ol>
                  </li>
                  <li>You must not create a Customer's account unless you are at least 18 years of age. If you are a parent or legal guardian permitting a person who is at least 13 years of age but under 18 years of age (a Minor) create a Customer account and/or use the Site, you agree to: (i) supervise the Minor's use of the Website and their account; (ii) assume all risks associated with, and liabilities resulting from, the Minor's use of the Website and their Customer account; (iii) ensure that the content on the Website is suitable for the Minor; (iv) ensure all information submitted to us by the Minor is accurate; and (v) provide the consents, representations and warranties contained in the Terms on the Minor's behalf.</li>
                  <li>By using and subscribing to our Services, you acknowledge that you have read, understood, and accepted this Agreement and you have the authority to act on behalf of any person or entity for whom you are using the Services, and you are deemed to have agreed to this Agreement on behalf of any entity for whom you use the Services.</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  3. Limitations of Use
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                  <li>Please read the following limitations and restrictions carefully. Any breach of the limitations and/or restrictions set out in these Terms may result, at Web to MCP's sole discretion, in the termination of your access to the Website and/or Software, and you may be exposed to civil and/or criminal liability.</li>
                  <li>By using the Website and/or Software, you warrant on behalf of yourself, your users, and other parties you represent that you will not:
                    <ol className="list-decimal list-inside ml-6 mt-2 space-y-1 text-zinc-300">
                      <li>modify, copy, prepare derivative works of, decompile, or reverse engineer any materials and software contained on this Website and/or Software;</li>
                      <li>introduce any code or device intended to interfere with or having the effect of interfering adversely with, the operation of any hardware or software, including any bugs, worms, logic bombs, trojan horses, viruses or any other self-propagating or other such program that may infect or cause damage to the Service or Web to MCP's systems or otherwise;</li>
                      <li>remove any copyright or other proprietary notations from any materials and software on this Website;</li>
                      <li>transfer the materials to another person or "mirror" the materials on any other server without Web to MCP's prior express written consent;</li>
                      <li>knowingly or negligently use this Website or any of its associated services in a way that abuses or disrupts our networks or any other service Web to MCP provides;</li>
                      <li>use this Website or its associated services to transmit or publish any harassing, indecent, obscene, fraudulent, or unlawful material;</li>
                      <li>use this Website or its associated services in violation of any applicable laws or regulations;</li>
                      <li>use this Website in conjunction with sending unauthorised advertising or spam;</li>
                      <li>harvest, collect, or gather user data without consent;</li>
                      <li>sell, license, or exploit for any commercial purposes any use of or access to the content of the Service and/or the Website;</li>
                      <li>use this Website or its associated services in such a way that may infringe the privacy, intellectual property rights, or other rights of third parties;</li>
                      <li>unauthorised use of any scraper, robot, bot, spider, crawler or any other automated device or means to access, acquire, copy or monitor any portion of the Website and/or Software or any data or content found or accessed through the Website; and</li>
                      <li>create, store, access, transfer to any third party or otherwise distribute any material which:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-zinc-300">
                          <li>is unlawful;</li>
                          <li>is or contains material which is harmful, obscene, defamatory, infringes any third party's rights including any third party's intellectual property rights;</li>
                          <li>is or contains material which is of a harassing or offensive nature;</li>
                          <li>contains sexually explicit or other offensive material;</li>
                          <li>promotes the use of unlawful violence against a person or property; or</li>
                          <li>is or contains material which is discriminatory based on race, origin, belief, sexual orientation, physical or mental disability, age or any other illegal category; or</li>
                          <li>infringes or violates any of these Terms.</li>
                        </ul>
                      </li>
                    </ol>
                  </li>
                  <li>If you operate a search engine, web crawler, bot, scraping tool, data mining tool, bulk downloading tool, wget utility, or similar data gathering or extraction tool, you may use the Website and/or Software, subject to the following conditions:
                    <ol className="list-decimal list-inside ml-6 mt-2 space-y-1 text-zinc-300">
                      <li>you must use a descriptive user agent header;</li>
                      <li>you must follow robots.txt at all times;</li>
                      <li>your access must not adversely affect any aspect of the Website and/or Software function; and</li>
                      <li>you must make it clear how to contact you, either in your user agent string, or on your website if you have one. You represent and warrant that you will not use any automated tools such as artificial intelligence or machine learning to (i) create derivative works of any materials and software contained on this Website and/or Software; (ii) to create any service competitive to Web to MCP's Services or (iii) for other commercial purposes except as expressly permitted by these Terms of Service or the written consent of Web to MCP.</li>
                    </ol>
                  </li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  4. Accounts and Subscriptions
                </h3>
                <h4 className="text-lg font-semibold text-zinc-100">4.1. Your Account</h4>
                <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                  <li>By registering for an account with us, you must provide us with accurate and complete information. It is your responsibility to keep your account information up to date.</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</li>
                  <li>You must notify us immediately of any unauthorized use of your account or any other breach of security.</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  5. Intellectual Property Rights
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  The Website and Software contain materials that are protected by copyright, trademark, and other intellectual property laws. Web to MCP retains all rights, title, and interest in and to the Website and Software, including all intellectual property rights.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  6. Privacy and Data Protection
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Services, to understand our practices regarding the collection and use of your personal information.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  7. Disclaimer of Liability
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                  <li>Our Website and the materials on our Website and/or Software are provided on an 'as is' basis and it is solely for reference only. To the extent permitted by law, Web to MCP makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property, or other violation of rights.</li>
                  <li>In no event shall Web to MCP or its suppliers be liable for any consequential loss suffered or incurred by you or any third party arising from the use or inability to use this Website or the materials on this Website, even if Web to MCP or an authorized representative has been notified, orally or in writing, of the possibility of such damage.</li>
                  <li>For the purpose of these Terms, "consequential loss" includes any consequential loss, indirect loss, real or anticipated loss of profit, loss of benefit, loss of revenue, loss of business, loss of goodwill, loss of opportunity, loss of savings, loss of reputation, loss of use and/or loss or corruption of data, whether under statute, contract, equity, tort (including negligence), indemnity, or otherwise.</li>
                  <li>Since some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  8. Indemnification
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  You agree to indemnify Web to MCP and hold harmless Web to MCP and its employees, officers, directors and agents from and against all claims, damages, costs, expenses, losses and liabilities (including but not limited to legal costs and expenses on a full indemnity basis) that arise directly or indirectly as a result from your access to and use of the materials on our Website and/or Software, any violation of these Terms by you, or any claim by any third party that its intellectual property rights have been infringed as a result from your use of the materials on our Website and/or Software.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  9. Accuracy of Materials
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  The materials appearing on our Website are not comprehensive and are for general reference purposes only. Web to MCP does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on this Website, or otherwise relating to such materials or on any resources linked to this website.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  10. Links to External Websites
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  In the case where you are linked to any external website from our Website, Web to MCP has not reviewed any of such external websites and shall not be responsible for the contents of any such linked sites. The inclusion of any link does not imply endorsement, approval, or control by Web to MCP. Use of any such linked site is at your own risk and we strongly advise you to do your own investigations with respect to the suitability of those sites.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  11. Modifications of Terms
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                  <li>Web to MCP reserves the right to review and amend any of these Terms at our sole discretion from time to time. Upon doing so, we will update our Website and provide you with reasonable notice of such changes, such as to the email address which you have provided to us. Unless otherwise stated, any changes to these Terms will take effect immediately once actual or constructive notice is given to you, which includes publication on our Website. Your continued use of the Website and/or Software after Web to MCP provides such notice will confirm your acceptance of the changes. If you do not agree to the amended Terms, you must stop accessing and using the Website and/or Software.</li>
                  <li>We recommend that you review the Terms periodically for updates and for the avoidance of doubt, we do not assume any responsibility for ensuring your attention and/or understanding to these Terms.</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  12. Modifications to the Services and Software
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  Web to MCP may at its own discretion and without providing prior notice, modify, adapt or change the Software and/or the Service's features, the user interface and design, the extent and availability of the material in the Services and any other aspect related to the Services. You shall have no claim, complaint, or demand against Web to MCP for effecting such changes or for failures incidental to such changes.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  13. Right to Terminate
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  We may at our sole discretion suspend or terminate your access to our Website and terminate these Terms immediately upon written notice to you for any breach of these Terms of Service.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  14. Severance
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  Any term of these Terms which is wholly or partially void or unenforceable is severed to the extent that it is void or unenforceable. The validity of the remainder of these Terms is not affected.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  15. Governing Law and Jurisdiction
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  These Terms are governed by and construed in accordance with the laws of India. You irrevocably submit to the exclusive jurisdiction of the courts in India. The courts of India shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with these terms.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  16. Termination
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                  <li>These terms will continue to apply until terminated by either you or us as follows.
                    <ol className="list-decimal list-inside ml-6 mt-2 space-y-1 text-zinc-300">
                      <li>You may stop using our Services any time by deactivating your account.</li>
                      <li>We reserve the right to suspend or terminate your access to our Website and/or Software, if we reasonably believe:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-zinc-300">
                          <li>you are in serious or repeated breach of these terms (including a prolonged failure to settle any payment);</li>
                          <li>you are using the Website and/or Software in a manner that would cause a real risk of harm or loss to us, other users, or the public;</li>
                          <li>we are requested to do so by government or regulatory authorities or as required under applicable laws, regulations or legal processes; or</li>
                          <li>our provision of the Website and/or Software to you is no longer possible or commercially viable.</li>
                        </ul>
                      </li>
                    </ol>
                  </li>
                  <li>In any of the above cases, we will notify you by the email address associated with your account or at the next time you attempt to access your account, unless we are prohibited from notifying you by law.</li>
                  <li>Upon termination of your access, these Terms will also terminate.</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  17. Contact
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  For any questions or problems relating to our Services and/or Website and/or our Software, or these Terms, you can contact us via email at <span className="text-zinc-100">team@web-to-mcp.com</span>.
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