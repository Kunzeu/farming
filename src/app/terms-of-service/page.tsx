'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, FileText, AlertTriangle, Shield, Users, Gavel } from 'lucide-react';
import Link from 'next/link';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function TermsOfServicePage() {
  usePageTitle('pageTitles.termsOfService', 'Terms of Service');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
            <p className="text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          <div className="bg-slate-800/50 rounded-lg p-8 space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                Agreement to Terms
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Welcome to True Farming! These Terms of Service ("Terms") govern your use of our website and services 
                related to Guild Wars 2 farming optimization. By accessing or using our services, you agree to be bound by these Terms.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Gavel className="w-6 h-6 text-green-400" />
                Acceptance of Terms
              </h2>
              <p className="text-gray-300 leading-relaxed">
                By creating an account, accessing our website, or using any of our services, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
              </p>
            </section>

            {/* Description of Service */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-400" />
                Description of Service
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                True Farming provides tools and resources to help Guild Wars 2 players optimize their farming activities, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Real-time Trading Post price analysis</li>
                <li>Farming route optimization tools</li>
                <li>Salvaging calculators and profit analysis</li>
                <li>Festival and event information</li>
                <li>Community features and user-generated content</li>
                <li>Educational resources and guides</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Users className="w-6 h-6 text-cyan-400" />
                User Accounts
              </h2>
              <h3 className="text-xl font-semibold text-white mb-3">Account Creation</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must be at least 13 years old to create an account</li>
                <li>One account per person is allowed</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">Account Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Keep your login information confidential</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>You are responsible for all activities that occur under your account</li>
                <li>Do not share your account with others</li>
              </ul>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                Acceptable Use Policy
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree to use our services only for lawful purposes and in accordance with these Terms. You agree NOT to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Transmit or distribute harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated tools to scrape or harvest data</li>
                <li>Interfere with the proper functioning of our services</li>
                <li>Impersonate others or provide false information</li>
                <li>Spam or send unsolicited communications</li>
                <li>Use our services for commercial purposes without permission</li>
              </ul>
            </section>

            {/* User-Generated Content */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">User-Generated Content</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our platform may allow you to submit content such as farming routes, comments, or other materials. By submitting content, you:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Grant us a non-exclusive, royalty-free license to use, display, and distribute your content</li>
                <li>Represent that you have the right to submit such content</li>
                <li>Understand that we may moderate or remove content that violates these Terms</li>
                <li>Agree that your content will not infringe on third-party rights</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
              <h3 className="text-xl font-semibold text-white mb-3">Our Content</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                All content on our website, including text, graphics, logos, and software, is owned by True Farming or our licensors 
                and is protected by copyright and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">Guild Wars 2 Content</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Guild Wars 2 is a trademark of ArenaNet, LLC. We are not affiliated with ArenaNet or NCsoft. 
                All Guild Wars 2 content, including game data accessed through the official API, remains the property of ArenaNet.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">Fair Use</h3>
              <p className="text-gray-300 leading-relaxed">
                Our use of Guild Wars 2 content is for educational and informational purposes under fair use principles. 
                We respect ArenaNet's intellectual property rights and use only publicly available data.
              </p>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, 
                and protect your information when you use our services.
              </p>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Disclaimers</h2>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <p className="text-yellow-200 font-semibold mb-2">Important Disclaimers:</p>
                <ul className="list-disc list-inside text-yellow-200 space-y-1 ml-4">
                  <li>Our services are provided "as is" without warranties of any kind</li>
                  <li>We do not guarantee the accuracy of market data or calculations</li>
                  <li>Gaming strategies and farming routes are suggestions only</li>
                  <li>We are not responsible for any losses or damages resulting from use of our services</li>
                  <li>We are not affiliated with ArenaNet, NCsoft, or Guild Wars 2</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                To the maximum extent permitted by law, True Farming shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of 
                or relating to your use of our services.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may terminate or suspend your account and access to our services at any time, with or without notice, 
                for any reason, including if you violate these Terms.
              </p>
              <p className="text-gray-300 leading-relaxed">
                You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting 
                the updated Terms on our website. Your continued use of our services after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms 
                or your use of our services shall be resolved through appropriate legal channels.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                <p className="text-gray-300">
                  <strong>Email:</strong> <a href="mailto:legal@truefarming.com" className="text-blue-400 hover:text-blue-300">legal@truefarming.com</a>
                </p>
                <p className="text-gray-300 mt-2">
                  <strong>Website:</strong> <a href="https://truefarming.com" className="text-blue-400 hover:text-blue-300">https://truefarming.com</a>
                </p>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
