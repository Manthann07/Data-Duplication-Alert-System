import React from 'react';

const Help = () => {
  const faqs = [
    {
      question: 'What is considered a duplicate record?',
      answer: 'A duplicate record is identified when two or more entries share significant similarities in key fields like name, email, phone number, or address. Our system uses advanced matching algorithms to detect potential duplicates based on configurable similarity thresholds.'
    },
    {
      question: 'How does the duplicate detection process work?',
      answer: 'Our system compares records using a weighted scoring system across multiple fields. Each field (name, email, phone, address) has an adjustable weight, and records that exceed the similarity threshold are flagged as potential duplicates.'
    },
    {
      question: 'Can I import data from different file formats?',
      answer: 'Yes, our system supports importing data from various formats including CSV, Excel (XLSX), and JSON files. The import wizard will guide you through mapping your data fields to our system fields.'
    },
    {
      question: 'What happens when I merge duplicate records?',
      answer: 'When merging duplicates, you can select which information to keep from each record. The system will combine the selected fields into a single record and archive the duplicate entries for reference.'
    },
    {
      question: 'Is there a limit to how many records I can manage?',
      answer: 'The number of records you can manage depends on your subscription plan. The basic plan includes up to 10,000 records, while premium plans offer higher limits and additional features.'
    },
    {
      question: 'Can I customize the duplicate detection rules?',
      answer: 'Yes, you can customize the detection rules through the Settings page. This includes adjusting the matching threshold and field weights to fine-tune how the system identifies potential duplicates.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Blue header section */}
      <div className="bg-blue-600 text-white py-16 -mx-6 px-6 mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <svg
              className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick help categories */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-blue-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Documentation</h3>
            <p className="text-gray-600 mb-4">Detailed guides and documentation to help you understand every feature.</p>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Browse Documentation →
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-blue-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Video Tutorials</h3>
            <p className="text-gray-600 mb-4">Step-by-step video guides to help you get started quickly.</p>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Watch Tutorials →
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-blue-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Community Support</h3>
            <p className="text-gray-600 mb-4">Join our community forum to get help from other users.</p>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Visit Forum →
            </a>
          </div>
        </div>
      </div>

      {/* FAQs section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-base font-medium text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help; 