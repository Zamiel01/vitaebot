import type { CVData } from "@/types/cv"
import { Mail, Phone, MapPin, Globe } from "lucide-react"

interface JamesWatsonTemplateProps {
  cvData: CVData
}

export function JamesWatsonTemplate({ cvData }: JamesWatsonTemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    languages,
    certifications,
    projects,
    publications,
    volunteering,
    awards,
    interests,
  } = cvData

  return (
    <div className="w-full min-h-[297mm] bg-white flex text-sm print:text-xs">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-slate-700 text-white p-8 flex flex-col">
        {/* Profile Image */}
        <div className="mb-8">
          <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-6 overflow-hidden">
            {personalInfo.profileImage ? (
              <img
                src={personalInfo.profileImage || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-3xl font-bold">
                {personalInfo.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-white">CONTACT</h3>
          <div className="space-y-3">
            {personalInfo.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm break-all">{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-white">SKILLS</h3>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{skill.name}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(skill.level / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-white">EDUCATION</h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="text-sm font-semibold text-white">{edu.degree}</h4>
                  <p className="text-sm text-gray-300">{edu.institution}</p>
                  <p className="text-sm text-gray-400">{edu.graduationYear}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-white">LANGUAGES</h3>
            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{lang.name}</span>
                    <span className="text-xs text-gray-300">{lang.proficiency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">CERTIFICATIONS</h3>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <h4 className="text-sm font-semibold text-white">{cert.name}</h4>
                  <p className="text-sm text-gray-300">{cert.issuer}</p>
                  <p className="text-sm text-gray-400">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{personalInfo.fullName || "Your Name"}</h1>
          <p className="text-lg text-gray-600 uppercase tracking-wide">
            {personalInfo.headline || "Your Professional Title"}
          </p>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">SUMMARY</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">EXPERIENCE</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-sm text-gray-600 font-medium">{exp.company}</p>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      {exp.startDate} - {exp.endDate}
                    </p>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    {exp.description.map((desc, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-3 text-gray-400">•</span>
                        <span className="leading-relaxed">{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">PROJECTS</h2>
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{project.name}</h3>
                      {project.url && <p className="text-sm text-gray-600">{project.url}</p>}
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      {project.startDate} - {project.endDate}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{project.description}</p>
                  {project.technologies && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Technologies:</span> {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publications */}
        {publications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">PUBLICATIONS</h2>
            <div className="space-y-4">
              {publications.map((pub) => (
                <div key={pub.id}>
                  <h3 className="text-base font-bold text-gray-900">{pub.title}</h3>
                  <p className="text-sm text-gray-600">
                    {pub.publisher} - {pub.date}
                  </p>
                  {pub.url && <p className="text-sm text-gray-600">{pub.url}</p>}
                  <p className="text-sm text-gray-700 leading-relaxed">{pub.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteering */}
        {volunteering.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">VOLUNTEERING</h2>
            <div className="space-y-6">
              {volunteering.map((vol) => (
                <div key={vol.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{vol.role}</h3>
                      <p className="text-sm text-gray-600 font-medium">{vol.organization}</p>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      {vol.startDate} - {vol.endDate}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{vol.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">AWARDS</h2>
            <div className="space-y-4">
              {awards.map((award) => (
                <div key={award.id}>
                  <h3 className="text-base font-bold text-gray-900">{award.title}</h3>
                  <p className="text-sm text-gray-600">
                    {award.issuer} - {award.date}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{award.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">INTERESTS</h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span key={interest.id} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                  {interest.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
