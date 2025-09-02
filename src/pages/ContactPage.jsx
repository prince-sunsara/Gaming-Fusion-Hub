// Contact page component
import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  HelpCircle,
  Bug,
  Lightbulb,
  Heart,
  Twitter,
  Group,
  Facebook,
  Github,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: Mail,
      label: "Email Us",
      value: "hello@gamingfusionhub.com",
      description: "General inquiries and support",
      action: "mailto:hello@gamingfusionhub.com",
    },
    {
      icon: Phone,
      label: "Call Us",
      value: "+1 (555) 123-GAME",
      description: "Available Monday to Friday",
      action: "tel:+15551234263",
    },
    {
      icon: MapPin,
      label: "Visit Us",
      value: "San Francisco, CA",
      description: "Gaming District, Tech Valley",
      action: "#",
    },
    {
      icon: Clock,
      label: "Business Hours",
      value: "9 AM - 6 PM PST",
      description: "Monday through Friday",
      action: "#",
    },
  ];

  const categories = [
    { id: "general", name: "General Inquiry", icon: MessageCircle },
    { id: "support", name: "Technical Support", icon: HelpCircle },
    { id: "bug", name: "Bug Report", icon: Bug },
    { id: "feature", name: "Feature Request", icon: Lightbulb },
    { id: "partnership", name: "Partnership", icon: Heart },
  ];

  const socialLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com/gamingfusionhub",
      color: "hover:text-blue-400",
    },
    {
      name: "Group",
      icon: Group,
      url: "https://Group.gg/gamingfusionhub",
      color: "hover:text-indigo-400",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com/gamingfusionhub",
      color: "hover:text-blue-600",
    },
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/gamingfusionhub",
      color: "hover:text-gray-400",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success/failure randomly for demo
      if (Math.random() > 0.1) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "general",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-6xl font-bold gradient-text mb-4 glitch"
            data-text="Contact Us"
          >
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions, feedback, or just want to say hello? We'd love to
            hear from you! Our gaming community team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <MessageCircle className="w-6 h-6 mr-3 text-primary-400" />
                Send us a Message
              </h2>

              {submitStatus && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                    submitStatus === "success"
                      ? "bg-green-500/20 border border-green-500/30 text-green-300"
                      : "bg-red-500/20 border border-red-500/30 text-red-300"
                  }`}
                >
                  {submitStatus === "success" ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>
                        Message sent successfully! We'll get back to you soon.
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      <span>
                        Failed to send message. Please try again or contact us
                        directly.
                      </span>
                    </>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map(({ id, name, icon: Icon }) => (
                      <label key={id} className="relative">
                        <input
                          type="radio"
                          name="category"
                          value={id}
                          checked={formData.category === id}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                            formData.category === id
                              ? "border-primary-500 bg-primary-500/10 text-primary-300"
                              : "border-dark-600 bg-dark-700 text-gray-300 hover:border-primary-500/50 hover:bg-dark-600"
                          }`}
                        >
                          <Icon className="w-5 h-5 mb-2" />
                          <span className="text-sm font-medium">{name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 resize-vertical"
                    placeholder="Tell us more about your question or feedback..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full btn-gaming py-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-3 transition-all duration-300 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info & Social */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Information */}
            <div className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                Get in Touch
              </h3>

              <div className="space-y-6">
                {contactInfo.map(
                  ({ icon: Icon, label, value, description, action }) => (
                    <div key={label} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">
                          {label}
                        </h4>
                        {action !== "#" ? (
                          <a
                            href={action}
                            className="text-primary-300 hover:text-primary-200 transition-colors duration-300 font-medium"
                          >
                            {value}
                          </a>
                        ) : (
                          <span className="text-primary-300 font-medium">
                            {value}
                          </span>
                        )}
                        <p className="text-gray-400 text-sm mt-1">
                          {description}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Follow Us</h3>
              <p className="text-gray-300 mb-6">
                Join our community on social media for the latest updates,
                gaming tips, and community discussions.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map(({ name, icon: Icon, url, color }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-3 p-3 bg-dark-700 hover:bg-dark-600 rounded-lg transition-all duration-300 text-gray-300 ${color} group`}
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">{name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ Link */}
            <div className="gaming-card bg-gradient-to-r from-accent-900/20 to-primary-900/20 rounded-xl border border-accent-500/30 p-6">
              <HelpCircle className="w-12 h-12 text-accent-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Quick Help</h3>
              <p className="text-gray-300 mb-4 text-sm">
                Looking for immediate answers? Check out our frequently asked
                questions.
              </p>
              <button className="w-full bg-accent-500 hover:bg-accent-400 text-white font-semibold py-3 rounded-lg transition-all duration-300">
                View FAQ
              </button>
            </div>

            {/* Response Time */}
            <div className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-6 text-center">
              <Clock className="w-8 h-8 text-primary-400 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-2">Response Time</h4>
              <p className="text-gray-300 text-sm">
                We typically respond within{" "}
                <span className="text-primary-300 font-semibold">24 hours</span>{" "}
                during business days.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Contact Options */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center gradient-text mb-8">
            Other Ways to Connect
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-6 text-center group hover:border-primary-500/50">
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Live Chat</h3>
              <p className="text-gray-300 mb-4">
                Get instant help with our live chat support during business
                hours.
              </p>
              <button className="btn-gaming px-6 py-2 rounded-lg font-semibold">
                <span>Start Chat</span>
              </button>
            </div>

            <div className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-6 text-center group hover:border-accent-500/50">
              <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Group className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Group Community
              </h3>
              <p className="text-gray-300 mb-4">
                Join our Group server to connect with other gamers and get
                community support.
              </p>
              <a
                href="#"
                className="inline-block bg-accent-500 hover:bg-accent-400 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
              >
                Join Group
              </a>
            </div>

            <div className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-6 text-center group hover:border-yellow-500/50">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Bug className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Bug Reports</h3>
              <p className="text-gray-300 mb-4">
                Found a bug? Report it directly through our dedicated bug
                tracking system.
              </p>
              <button className="bg-yellow-500 hover:bg-yellow-400 text-dark-900 px-6 py-2 rounded-lg font-semibold transition-all duration-300">
                Report Bug
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
