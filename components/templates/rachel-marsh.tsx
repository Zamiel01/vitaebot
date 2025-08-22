import type { CVData } from "@/types/cv"
import { Mail, Phone, MapPin, Globe } from "lucide-react"

interface RachelMarshTemplateProps {
  cvData: CVData
}

export function RachelMarshTemplate({ cvData }: RachelMarshTemplateProps) {
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
    <div className="w-full h-full bg-white text-xs">
      {/* Header */}
      <div className="flex items-center p-6 border-b border-gray-200">
        <div className="w-16 h-16 rounded-full bg-gray-300 mr-4 overflow-hidden flex-shrink-0">
          {personalInfo.profileImage ? (
            <img
              src={personalInfo.profileImage || "/placeholder.svg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-lg font-bold">
              {personalInfo.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-teal-600 mb-1">{personalInfo.fullName || "Your Name"}</h1>
          <p className="text-sm text-gray-600 uppercase tracking-wide">
            {personalInfo.headline || "Your Professional Title"}
          </p>
        </div>
      </div>

      <div className="flex">
        {/* Left Content */}
        <div className="flex-1 p-6">
          {/* Summary */}
          {summary && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-teal-600 mb-2 uppercase">Summary</h2>
              <p className="text-xs text-gray-700 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-teal-600 mb-3 uppercase">Experience</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-xs font-bold text-gray-900">{exp.position}</h3>
                        <p className="text-xs text-teal-600 font-semibold">{exp.company}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {exp.startDate} - {exp.endDate}
                      </p>
                    </div>
                    <ul className="text-xs text-gray-700 space-y-1 ml-2">
                      {exp.description.map((desc, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-teal-600">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-teal-600 mb-3 uppercase">Education</h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-xs font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-xs text-teal-600 font-semibold">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.graduationYear}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-teal-600 mb-3 uppercase">Projects</h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-xs font-bold text-gray-900">{project.name}</h3>
                        {project.url && <p className="text-xs text-teal-600">{project.url}</p>}
                      </div>
                      <p className="text-xs text-gray-500">
                        {project.startDate} - {project.endDate}
                      </p>
                    </div>
                    <p className="text-xs text-gray-700">{project.description}</p>
                    {project.technologies && (
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="font-medium">Tech:</span> {project.technologies}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publications */}
          {publications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-teal-600 mb-3 uppercase">Publications</h2>
              <div className="space-y-3">
                {publications.map((pub) => (
                  <div key={pub.id}>
                    <h3 className="text-xs font-bold text-gray-900">{pub.title}</h3>
                    <p className="text-xs text-teal-600">
                      {pub.publisher} - {pub.date}
                    </p>
                    {pub.url && <p className="text-xs text-gray-600">{pub.url}</p>}
                    <p className="text-xs text-gray-700">{pub.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Volunteering */}
          {volunteering.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-teal-600 mb-3 uppercase">Volunteering</h2>
              <div className="space-y-4">
                {volunteering.map((vol) => (
                  <div key={vol.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-xs font-bold text-gray-900">{vol.role}</h3>
                        <p className="text-xs text-teal-600 font-semibold">{vol.organization}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {vol.startDate} - {vol.endDate}
                      </p>
                    </div>
                    <p className="text-xs text-gray-700">{vol.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {awards.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-teal-600 mb-3 uppercase">Awards</h2>
              <div className="space-y-3">
                {awards.map((award) => (
                  <div key={award.id}>
                    <h3 className="text-xs font-bold text-gray-900">{award.title}</h3>
                    <p className="text-xs text-teal-600">
                      {award.issuer} - {award.date}
                    </p>
                    <p className="text-xs text-gray-700">{award.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-1/3 bg-gray-50 p-6">
          {/* Contact */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-teal-600 mb-3 uppercase">Contact</h3>
            <div className="space-y-2">
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-teal-600" />
                  <span className="text-xs">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-teal-600" />
                  <span className="text-xs">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-teal-600" />
                  <span className="text-xs">{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3 text-teal-600" />
                  <span className="text-xs">{personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-teal-600 mb-3 uppercase">Skills</h3>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-teal-100 px-2 py-1 rounded text-xs text-teal-800">
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-teal-600 mb-3 uppercase">Languages</h3>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between">
                    <span className="text-xs text-gray-700">{lang.name}</span>
                    <span className="text-xs text-teal-600">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-teal-600 mb-3 uppercase">Certifications</h3>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <h4 className="text-xs font-bold text-gray-900">{cert.name}</h4>
                    <p className="text-xs text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">{cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-teal-600 mb-3 uppercase">Interests</h3>
              <div className="flex flex-wrap gap-1">
                {interests.map((interest) => (
                  <span key={interest.id} className="bg-teal-100 px-2 py-1 rounded text-xs text-teal-800">
                    {interest.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
