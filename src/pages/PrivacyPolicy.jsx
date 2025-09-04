import React from "react";
import { Shield, Eye, Lock, Users, Database, Settings } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>
          <p className="text-slate-400 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Eye className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Introduction</h2>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Welcome to Gaming Fusion Hub ("we," "our," or "us"). This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website and use
                our browser-based games. We are committed to protecting your
                privacy and being transparent about our data practices.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Database className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">
                  Information We Collect
                </h2>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">
                    Information You Provide
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>
                      • Account information (username, email address, password)
                    </li>
                    <li>
                      • Profile details (display name, avatar, preferences)
                    </li>
                    <li>
                      • Game data (high scores, achievements, progress,
                      settings)
                    </li>
                    <li>
                      • Communications (support requests, feedback, comments)
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">
                    Information Automatically Collected
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>
                      • Usage data (pages visited, games played, session
                      duration)
                    </li>
                    <li>
                      • Device information (browser type, OS, screen resolution)
                    </li>
                    <li>
                      • Technical data (IP address, general location,
                      performance metrics)
                    </li>
                    <li>• Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">
                  How We Use Your Information
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-4">
                    Primary Uses
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Provide and maintain gaming services</li>
                    <li>• Manage user accounts and profiles</li>
                    <li>• Save game progress and achievements</li>
                    <li>• Personalize gaming experience</li>
                  </ul>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-4">
                    Secondary Uses
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Analyze usage patterns for improvements</li>
                    <li>• Send important service updates</li>
                    <li>• Provide customer support</li>
                    <li>• Detect and prevent security threats</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-orange-400" />
                <h2 className="text-2xl font-bold text-white">
                  Information Sharing
                </h2>
              </div>

              <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-red-400 mb-3">
                  We Do Not Sell Personal Information
                </h3>
                <p className="text-slate-300">
                  We do not sell, rent, or trade your personal information to
                  third parties for marketing purposes.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-orange-400">
                  Limited Sharing Scenarios
                </h3>
                <ul className="text-slate-300 space-y-2">
                  <li>
                    • <strong>Service Providers:</strong> Trusted third-party
                    services (hosting, analytics, support)
                  </li>
                  <li>
                    • <strong>Legal Requirements:</strong> When required by law
                    or to protect our rights
                  </li>
                  <li>
                    • <strong>Business Transfers:</strong> In case of merger,
                    acquisition, or sale of assets
                  </li>
                  <li>
                    • <strong>Safety Protection:</strong> To protect user safety
                    or prevent harm
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Lock className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Data Security</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4">
                    Security Measures
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Industry-standard encryption</li>
                    <li>• Secure data transmission (HTTPS)</li>
                    <li>• Regular security assessments</li>
                    <li>• Access controls and monitoring</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4">
                    Data Retention
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Account data: Until account deletion</li>
                    <li>• Game progress: 2 years of inactivity</li>
                    <li>• Analytics data: 26 months maximum</li>
                    <li>• Support communications: 3 years</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Your Privacy Rights
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-400">
                      Access & Portability
                    </h3>
                    <p className="text-slate-300 text-sm mt-2">
                      Request a copy of your personal data
                    </p>
                  </div>

                  <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-400">
                      Correction
                    </h3>
                    <p className="text-slate-300 text-sm mt-2">
                      Update or correct your information
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-red-400">
                      Deletion
                    </h3>
                    <p className="text-slate-300 text-sm mt-2">
                      Request deletion of your account and data
                    </p>
                  </div>

                  <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-400">
                      Opt-out
                    </h3>
                    <p className="text-slate-300 text-sm mt-2">
                      Withdraw consent for data processing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
              <div className="space-y-4 text-slate-300">
                <p>
                  If you have questions about this Privacy Policy or our data
                  practices, please contact us:
                </p>
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <ul className="space-y-2">
                    <li>
                      <strong>Email:</strong> privacy@gamingfusionhub.com
                    </li>
                    <li>
                      <strong>Address:</strong> [Your Business Address]
                    </li>
                    <li>
                      <strong>Phone:</strong> [Your Contact Number]
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Policy Updates
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. We encourage you
                to review this Privacy Policy periodically for any changes.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
