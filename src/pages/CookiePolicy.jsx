import React, { useState } from "react";
import {
  Cookie,
  Settings,
  BarChart3,
  Shield,
  Eye,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const CookiePolicy = () => {
  const [cookieSettings, setCookieSettings] = useState({
    essential: true, // Always enabled
    analytics: true,
    performance: false,
    marketing: false,
  });

  const handleCookieToggle = (type) => {
    if (type === "essential") return; // Cannot disable essential cookies
    setCookieSettings((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3">
            <Cookie className="w-8 h-8 text-orange-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Cookie Policy
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
                <Eye className="w-6 h-6 text-orange-400" />
                <h2 className="text-2xl font-bold text-white">
                  What Are Cookies?
                </h2>
              </div>
              <div className="space-y-4 text-slate-300">
                <p className="leading-relaxed">
                  Cookies are small text files that are placed on your device
                  when you visit Gaming Fusion Hub. They help us provide you
                  with a better gaming experience by remembering your
                  preferences, tracking your progress, and improving our
                  services.
                </p>
                <div className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-400 mb-3">
                    Why We Use Cookies
                  </h3>
                  <ul className="space-y-2">
                    <li>• Save your game progress and settings</li>
                    <li>• Keep you logged in between sessions</li>
                    <li>
                      • Analyze how our games are played to make improvements
                    </li>
                    <li>
                      • Ensure optimal performance across different devices
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Cookie Settings Panel */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">
                  Cookie Preferences
                </h2>
              </div>

              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">
                        Essential Cookies
                      </h3>
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                        Required
                      </span>
                    </div>
                    <div className="text-green-400">
                      <ToggleRight className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">
                    These cookies are necessary for the website to function and
                    cannot be switched off. They are usually only set in
                    response to actions made by you.
                  </p>
                  <div className="text-xs text-slate-400">
                    <strong>Examples:</strong> User authentication, session
                    management, security features
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">
                        Analytics Cookies
                      </h3>
                    </div>
                    <button
                      onClick={() => handleCookieToggle("analytics")}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {cookieSettings.analytics ? (
                        <ToggleRight className="w-6 h-6" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">
                    These cookies help us understand how visitors interact with
                    our games and website by collecting and reporting
                    information anonymously.
                  </p>
                  <div className="text-xs text-slate-400">
                    <strong>Examples:</strong> Game completion rates, popular
                    features, error tracking
                  </div>
                </div>

                {/* Performance Cookies */}
                <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">
                        Performance Cookies
                      </h3>
                    </div>
                    <button
                      onClick={() => handleCookieToggle("performance")}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {cookieSettings.performance ? (
                        <ToggleRight className="w-6 h-6" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">
                    These cookies allow us to count visits and traffic sources
                    to measure and improve the performance of our games and
                    website.
                  </p>
                  <div className="text-xs text-slate-400">
                    <strong>Examples:</strong> Loading times, frame rates,
                    optimization metrics
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-lg font-semibold text-white">
                        Marketing Cookies
                      </h3>
                    </div>
                    <button
                      onClick={() => handleCookieToggle("marketing")}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      {cookieSettings.marketing ? (
                        <ToggleRight className="w-6 h-6" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">
                    These cookies track your activity across websites to deliver
                    more relevant advertisements and promotional content.
                  </p>
                  <div className="text-xs text-slate-400">
                    <strong>Examples:</strong> Personalized ads, social media
                    integration, remarketing
                  </div>
                </div>

                {/* Save Preferences Button */}
                <div className="flex justify-center pt-4">
                  <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all shadow-lg">
                    Save Cookie Preferences
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Detailed Cookie Information */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Detailed Cookie Information
              </h2>

              <div className="space-y-8">
                {/* First Party Cookies */}
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-blue-400 mb-4">
                    First-Party Cookies
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left text-slate-300 py-2">
                            Cookie Name
                          </th>
                          <th className="text-left text-slate-300 py-2">
                            Purpose
                          </th>
                          <th className="text-left text-slate-300 py-2">
                            Duration
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        <tr className="border-b border-slate-700">
                          <td className="py-2 font-mono text-orange-400">
                            gfh_session
                          </td>
                          <td className="py-2">User session management</td>
                          <td className="py-2">Session</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 font-mono text-orange-400">
                            gfh_preferences
                          </td>
                          <td className="py-2">
                            Game settings and preferences
                          </td>
                          <td className="py-2">1 year</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 font-mono text-orange-400">
                            gfh_progress
                          </td>
                          <td className="py-2">Game progress and scores</td>
                          <td className="py-2">2 years</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-orange-400">
                            gfh_auth
                          </td>
                          <td className="py-2">Authentication token</td>
                          <td className="py-2">30 days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Third Party Cookies */}
                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-4">
                    Third-Party Cookies
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">
                        Google Analytics
                      </h4>
                      <p className="text-slate-300 text-sm mb-2">
                        Helps us understand user behavior and improve our games.
                      </p>
                      <div className="text-xs text-slate-400">
                        <strong>Cookies:</strong> _ga, _ga_*, _gid |{" "}
                        <strong>Duration:</strong> 2 years
                      </div>
                    </div>

                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">
                        Cloudflare
                      </h4>
                      <p className="text-slate-300 text-sm mb-2">
                        Provides security and performance optimization for our
                        website.
                      </p>
                      <div className="text-xs text-slate-400">
                        <strong>Cookies:</strong> __cf_bm, cf_clearance |{" "}
                        <strong>Duration:</strong> 30 minutes - 1 year
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Managing Cookies */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Managing Your Cookies
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-400 mb-4">
                    Browser Settings
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">
                    You can control cookies through your browser settings. Most
                    browsers allow you to:
                  </p>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• View and delete cookies</li>
                    <li>• Block cookies from specific sites</li>
                    <li>• Block third-party cookies</li>
                    <li>• Clear all cookies when closing browser</li>
                  </ul>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-4">
                    Our Cookie Controls
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Use our cookie preference panel above to customize your
                    experience:
                  </p>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• Enable/disable non-essential cookies</li>
                    <li>• See exactly what data we collect</li>
                    <li>• Update preferences anytime</li>
                    <li>• Granular control over cookie types</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Browser-Specific Instructions */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Browser-Specific Cookie Management
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Chrome</h3>
                  <p className="text-slate-300 text-sm">
                    Settings → Privacy and Security → Cookies and other site
                    data
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Firefox</h3>
                  <p className="text-slate-300 text-sm">
                    Options → Privacy & Security → Cookies and Site Data
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Safari</h3>
                  <p className="text-slate-300 text-sm">
                    Preferences → Privacy → Manage Website Data
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Edge</h3>
                  <p className="text-slate-300 text-sm">
                    Settings → Site permissions → Cookies and site data
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Opera</h3>
                  <p className="text-slate-300 text-sm">
                    Settings → Advanced → Privacy & security → Site settings
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Mobile</h3>
                  <p className="text-slate-300 text-sm">
                    Browser settings → Privacy → Clear browsing data
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Impact of Disabling Cookies */}
          <section className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Impact of Disabling Cookies
              </h2>

              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-4">
                  What Happens When You Disable Cookies?
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">
                      Essential Cookies (Cannot Disable)
                    </h4>
                    <ul className="text-slate-300 space-y-1 text-sm">
                      <li>• Website will not function properly</li>
                      <li>• Unable to stay logged in</li>
                      <li>• Settings won't be remembered</li>
                      <li>• Security features may be compromised</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3">
                      Non-Essential Cookies
                    </h4>
                    <ul className="text-slate-300 space-y-1 text-sm">
                      <li>• Less personalized experience</li>
                      <li>• Game recommendations may be less relevant</li>
                      <li>• We can't improve services based on your usage</li>
                      <li>• Some features may not work optimally</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-orange-900/30 to-yellow-900/30 backdrop-blur-md rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Questions About Cookies?
              </h2>
              <div className="space-y-4 text-slate-300">
                <p>
                  If you have questions about our use of cookies or this Cookie
                  Policy, please contact us:
                </p>
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <ul className="space-y-2">
                    <li>
                      <strong>Email:</strong> cookies@gamingfusionhub.com
                    </li>
                    <li>
                      <strong>Privacy Team:</strong> privacy@gamingfusionhub.com
                    </li>
                    <li>
                      <strong>Address:</strong> [Your Business Address]
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
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. We will notify you of any material changes
                by posting the updated policy on our website with a new "Last
                updated" date.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
