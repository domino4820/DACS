import React from "react";
import { Link } from "react-router-dom";
import { Award, BookOpen, Code, HeartHandshake, Users } from "lucide-react";

export default function AboutPage() {
  // Top languages (similar to W3Schools top bar)
  const topLanguages = [
    "HTML",
    "CSS",
    "JAVASCRIPT",
    "SQL",
    "PYTHON",
    "JAVA",
    "PHP",
    "HOW TO",
    "C",
    "C++",
    "C#",
    "BOOTSTRAP",
    "REACT",
    "MYSQL",
  ];

  // Team members
  const teamMembers = [
    {
      name: "John Smith",
      role: "Founder & Lead Developer",
      image: "https://i.pravatar.cc/150?img=1",
      bio: "John has over 10 years of experience in web development and education.",
    },
    {
      name: "Jane Doe",
      role: "Content Director",
      image: "https://i.pravatar.cc/150?img=5",
      bio: "Jane specializes in creating engaging educational materials for technical subjects.",
    },
    {
      name: "David Johnson",
      role: "UX Designer",
      image: "https://i.pravatar.cc/150?img=3",
      bio: "David is passionate about creating intuitive and accessible user interfaces.",
    },
  ];

  return (
    <div>
      {/* Top language navigation bar */}
      <div className="bg-secondary-color text-white text-sm overflow-x-auto whitespace-nowrap py-3 px-4">
        <div className="container mx-auto">
          {topLanguages.map((lang, index) => (
            <a
              key={index}
              href="#"
              className="inline-block mx-2 hover:text-green-300 transition-colors"
            >
              {lang}
            </a>
          ))}
        </div>
      </div>

      {/* About Hero Section */}
      <div className="bg-secondary-color py-20 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            About Hutech.IO
          </h1>
          <p className="text-xl mb-8 text-white">
            Guiding your journey through the world of technology with structured
            learning paths and expert resources.
          </p>
          <Link
            to="/roadmaps"
            className="learning-btn learning-btn-hover text-lg px-8 py-3 bg-white text-secondary-color hover:bg-gray-100"
          >
            Explore Our Roadmaps
          </Link>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Our Mission
          </h2>
          <div className="learning-example">
            <div className="learning-example-header text-gray-800">
              What We Do
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                At Hutech.IO, we believe that learning technology should be
                accessible, structured, and enjoyable. Our mission is to provide
                clear, well-organized learning paths that guide users from
                beginners to experts in various technical domains.
              </p>
              <p className="text-gray-700">
                We combine expert knowledge, community insights, and industry
                best practices to create roadmaps that truly reflect the skills
                needed in today's technical landscape. Our platform is designed
                to help learners navigate the complex world of technology
                education with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Accessible Education
                </h3>
                <p className="text-gray-600">
                  We believe everyone should have access to quality technical
                  education, regardless of their background or circumstances.
                </p>
              </div>
            </div>

            <div className="flex items-start bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Practical Skills
                </h3>
                <p className="text-gray-600">
                  Our roadmaps focus on building practical, applicable skills
                  that are relevant to real-world technical challenges.
                </p>
              </div>
            </div>

            <div className="flex items-start bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Community Driven
                </h3>
                <p className="text-gray-600">
                  We value the insights and contributions of our community
                  members who help shape our content and platform.
                </p>
              </div>
            </div>

            <div className="flex items-start bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Excellence
                </h3>
                <p className="text-gray-600">
                  We strive for excellence in everything we do, from the quality
                  of our roadmaps to the user experience of our platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="text-center bg-gray-50 p-6 rounded-lg shadow-sm"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-green-100"
                />
                <h3 className="text-xl font-bold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-green-600 mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-green-600 text-center">
        <div className="container mx-auto max-w-3xl">
          <HeartHandshake className="h-16 w-16 mx-auto mb-6 text-white" />
          <h2 className="text-3xl font-bold mb-6 text-white">
            Join Our Community
          </h2>
          <p className="text-xl mb-8 text-white">
            Start your learning journey today and connect with others who share
            your passion for technology.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="learning-btn learning-btn-hover bg-white text-green-600 hover:bg-gray-100 px-8 py-3"
            >
              Sign Up
            </Link>
            <Link
              to="/roadmaps"
              className="learning-btn learning-btn-hover bg-transparent border-2 border-white text-white hover:bg-green-700 px-8 py-3"
            >
              Browse Roadmaps
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
