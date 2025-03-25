import React from 'react';

const HelpCenter = () => {
  const categories = [
    {
      id: 1,
      title: 'Getting Started',
      description: 'Learn how to get up to speed quickly',
      icon: '🚀',
      link: '/help/getting-started'
    },
    {
      id: 2,
      title: 'Account Management',
      description: 'Manage your account and user preferences',
      icon: '👤',
      link: '/help/account'
    },
    {
      id: 3,
      title: 'Billing & Subscriptions',
      description: 'View billing history and manage subscriptions',
      icon: '💳',
      link: '/help/billing'
    },
    {
      id: 4,
      title: 'Security & Privacy',
      description: 'Learn about our security practices',
      icon: '🔒',
      link: '/help/security'
    },
    {
      id: 5,
      title: 'Data Management',
      description: 'Manage and organize your data effectively',
      icon: '📊',
      link: '/help/data'
    },
    {
      id: 6,
      title: 'Troubleshooting',
      description: 'Solve common issues and problems',
      icon: '🔧',
      link: '/help/troubleshooting'
    },
    {
      id: 7,
      title: 'API Documentation',
      description: 'Technical guide for developers',
      icon: '📚',
      link: '/help/api'
    },
    {
      id: 8,
      title: 'Best Practices',
      description: 'Tips and recommendations for success',
      icon: '✨',
      link: '/help/best-practices'
    }
  ];

  const faqs = [
    {
      id: 1,
      question: 'How do I get started?',
      answer: 'Getting started is easy! Simply sign up for an account and follow our quick start guide.'
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers.'
    },
    {
      id: 3,
      question: 'How can I reset my password?',
      answer: 'Click on the "Forgot Password" link on the login page and follow the instructions sent to your email.'
    },
    {
      id: 4,
      question: 'How do I contact support?',
      answer: 'You can reach our support team through the contact form below or email us directly.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-lg text-muted-foreground mb-8">Find answers to your questions and get the help you need</p>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles, tutorials, and FAQs..."
                className="w-full px-6 py-4 bg-background border rounded-xl pl-12"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {['Getting Started', 'Account Settings', 'Billing', 'Security'].map((link) => (
            <button
              key={link}
              className="px-4 py-2 text-sm rounded-full bg-accent text-accent-foreground hover:bg-accent/80"
            >
              {link}
            </button>
          ))}
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((category) => (
            <a
              key={category.id}
              href={category.link}
              className="p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{category.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </a>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="group bg-card rounded-lg p-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer">
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                  <span className="ml-6 flex-shrink-0">
                    <svg
                      className="w-5 h-5 transition duration-300 group-open:rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-center">
          <div className="p-8 bg-card rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Contact Support Team</h3>
            <p className="text-muted-foreground mb-6">Get personalized help from our dedicated support team</p>
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
              Submit Ticket
            </button>
          </div>
          
          <div className="p-8 bg-card rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Join Community</h3>
            <p className="text-muted-foreground mb-6">Connect with other users and share experiences</p>
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
              Visit Forum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter; 