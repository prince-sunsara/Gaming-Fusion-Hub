import React from "react";
import {
  FileText,
  Scale,
  AlertTriangle,
  Shield,
  Gamepad2,
  Ban,
} from "lucide-react";

const TermsAndCondition = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Terms of Service
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
          {/* Agreement */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Scale className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">
                  Agreement to Terms
                </h2>
              </div>
              <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-6">
                <p className="text-slate-300 leading-relaxed">
                  By accessing and using Gaming Fusion Hub ("the Service"), you
                  agree to be bound by these Terms of Service ("Terms"). If you
                  disagree with any part of these terms, then you may not access
                  the Service. These Terms apply to all visitors, users, and
                  others who access or use our gaming platform.
                </p>
              </div>
            </div>
          </section>

          {/* Service Description */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Gamepad2 className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Our Service</h2>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">
                    What We Provide
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>
                      • Free-to-play browser-based games accessible on various
                      devices
                    </li>
                    <li>
                      • User accounts for saving progress and achievements
                    </li>
                    <li>
                      • Leaderboards and social features for competitive gaming
                    </li>
                    <li>• Regular updates and new game content</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">
                    Service Availability
                  </h3>
                  <p className="text-slate-300">
                    We strive to maintain 99% uptime but cannot guarantee
                    uninterrupted service. We reserve the right to modify,
                    suspend, or discontinue any part of our service with
                    reasonable notice to users.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                User Accounts
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-4">
                    Account Responsibilities
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Provide accurate registration information</li>
                    <li>• Keep your password secure and confidential</li>
                    <li>• Notify us of any security breaches</li>
                    <li>• Use only one account per person</li>
                    <li>• Update account information as needed</li>
                  </ul>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-4">
                    Account Restrictions
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Must be 13+ years old to create account</li>
                    <li>• No sharing of account credentials</li>
                    <li>• No automated account creation</li>
                    <li>• No impersonation of others</li>
                    <li>• No sale or transfer of accounts</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">
                  Acceptable Use Policy
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-green-400 mb-4">
                    Permitted Activities
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Playing games for personal entertainment</li>
                    <li>• Creating and customizing your gaming profile</li>
                    <li>• Participating in leaderboards and competitions</li>
                    <li>• Sharing gameplay experiences and screenshots</li>
                    <li>• Providing feedback and suggestions</li>
                  </ul>
                </div>

                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-red-400 mb-4">
                    Prohibited Activities
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>
                      • Using cheats, hacks, or exploits to gain unfair
                      advantages
                    </li>
                    <li>
                      • Harassment, bullying, or toxic behavior toward other
                      users
                    </li>
                    <li>
                      • Attempting to reverse engineer or modify our games
                    </li>
                    <li>
                      • Distributing malware or engaging in phishing attempts
                    </li>
                    <li>• Commercial use without explicit permission</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Intellectual Property Rights
              </h2>

              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">
                    Our Content
                  </h3>
                  <p className="text-slate-300">
                    All games, graphics, audio, code, and other content on
                    Gaming Fusion Hub are owned by us or our licensors. This
                    includes but is not limited to game mechanics, artwork,
                    music, sound effects, and user interface elements. You may
                    not copy, distribute, or create derivative works without
                    permission.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">
                    Your Content
                  </h3>
                  <p className="text-slate-300">
                    Any content you create or share through our platform
                    (usernames, comments, feedback) remains yours, but you grant
                    us a license to use, display, and distribute it in
                    connection with our service. You represent that you own or
                    have permission to share any content you provide.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Privacy and Data Use
              </h2>
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6">
                <p className="text-slate-300 leading-relaxed mb-4">
                  Your privacy is important to us. Our collection and use of
                  personal information is governed by our Privacy Policy, which
                  is incorporated into these Terms by reference.
                </p>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">
                    Key Privacy Points:
                  </h4>
                  <ul className="text-slate-300 space-y-1">
                    <li>
                      • We collect minimal necessary data for service operation
                    </li>
                    <li>
                      • Game progress and scores are stored to enhance your
                      experience
                    </li>
                    <li>
                      • We use analytics to improve our games and platform
                    </li>
                    <li>
                      • We do not sell personal information to third parties
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">
                  Disclaimers and Limitations
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-3">
                    Service "As Is"
                  </h3>
                  <p className="text-slate-300">
                    Our gaming service is provided "as is" without warranties of
                    any kind. We do not guarantee that games will be error-free,
                    uninterrupted, or free from harmful components. Use of our
                    service is at your own risk.
                  </p>
                </div>

                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-red-400 mb-3">
                    Limitation of Liability
                  </h3>
                  <p className="text-slate-300">
                    To the maximum extent permitted by law, Gaming Fusion Hub
                    shall not be liable for any indirect, incidental, special,
                    consequential, or punitive damages, including but not
                    limited to loss of profits, data, or other intangible
                    losses.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Ban className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-white">
                  Account Termination
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-400 mb-4">
                    By You
                  </h3>
                  <p className="text-slate-300 mb-4">
                    You may terminate your account at any time by contacting our
                    support team or using account deletion features.
                  </p>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• Immediate cessation of service access</li>
                    <li>• Data deletion according to privacy policy</li>
                    <li>• No refunds for unused services</li>
                  </ul>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-4">
                    By Us
                  </h3>
                  <p className="text-slate-300 mb-4">
                    We may suspend or terminate accounts that violate these
                    terms or engage in harmful behavior.
                  </p>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• Cheating or exploiting game mechanics</li>
                    <li>• Harassment or toxic behavior</li>
                    <li>• Violation of applicable laws</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Legal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-400 mb-4">
                    Governing Law
                  </h3>
                  <p className="text-slate-300">
                    These Terms shall be governed by and construed in accordance
                    with the laws of [Your Jurisdiction], without regard to
                    conflict of law principles.
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-4">
                    Dispute Resolution
                  </h3>
                  <p className="text-slate-300">
                    Any disputes arising from these Terms will be resolved
                    through binding arbitration or in the courts of [Your
                    Jurisdiction].
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Changes to Terms
              </h2>
              <div className="space-y-4 text-slate-300">
                <p>
                  We reserve the right to modify these Terms at any time. We
                  will provide notice of material changes through our website,
                  email, or in-game notifications.
                </p>
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <h4 className="text-purple-400 font-semibold mb-3">
                    What This Means:
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      • Continued use after changes constitutes acceptance
                    </li>
                    <li>
                      • You can review the latest version anytime on our website
                    </li>
                    <li>• Major changes will be highlighted and explained</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Contact Information
              </h2>
              <div className="space-y-4 text-slate-300">
                <p>Questions about these Terms of Service? Contact us:</p>
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <ul className="space-y-2">
                    <li>
                      <strong>Email:</strong> legal@gamingfusionhub.com
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
        </div>
      </div>
    </div>
  );
};

export default TermsAndCondition;
