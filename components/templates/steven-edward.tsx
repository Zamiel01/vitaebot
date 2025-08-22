import type { CVData } from "@/types/cv"
import { Mail, Phone, MapPin, Globe } from "lucide-react"

interface StevenEdwardTemplateProps {
  cvData: CVData
}

export function StevenEdwardTemplate({ cvData }: StevenEdwardTemplateProps) {
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
    <div className="w-full h-full bg-white flex text-xs">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-green-700 text-white p-6">
        {/* Profile Image */}
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
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
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3 text-white">CONTACT</h3>
          <div className="space-y-2">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span className="text-xs">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                <span className="text-xs">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3" />
                <span className="text-xs">{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3 text-white">SKILLS</h3>
            <div className="space-y-1">
              {skills.map((skill) => (
                <div key={skill.id} className="text-xs">
                  <span>• {skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3 text-white">LANGUAGES</h3>
            <div className="space-y-1">
              {languages.map((language) => (
                <div key={language.id} className="text-xs">
                  <span>
                    • {language.name}  {language.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3 text-white">CERTIFICATIONS</h3>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <h4 className="text-xs font-semibold">{cert.name}</h4>
                  <p className="text-xs text-green-200">{cert.issuer}</p>
                  <p className="text-xs text-green-300">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h3 className="text-sm font-bold mb-3 text-white">EDUCATION</h3>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="text-xs font-semibold">{edu.degree}</h4>
                  <p className="text-xs text-green-200">{edu.institution}</p>
                  <p className="text-xs text-green-300">{edu.graduationYear}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{personalInfo.fullName || "Your Name"}</h1>
          <p className="text-sm text-gray-600 uppercase tracking-wide">
            {personalInfo.headline || "Your Professional Title"}
          </p>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-green-700 mb-2 uppercase">Summary</h2>
            <p className="text-xs text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-green-700 mb-3 uppercase">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-xs font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-xs text-green-700 font-semibold">{exp.company}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {exp.startDate} - {exp.endDate}
                    </p>
                  </div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {exp.description.map((desc, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-green-700">•</span>
                        <span>{desc}</span>
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
          <div className="mb-6">
            <h2 className="text-sm font-bold text-green-700 mb-3 uppercase">Projects</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xs font-bold text-gray-900">{project.name}</h3>
                    <p className="text-xs text-gray-500">
                      {project.startDate} - {project.endDate}
                    </p>
                  </div>
                  <p className="text-xs text-gray-700 mb-1">{project.description}</p>
                  {project.technologies && (
                    <p className="text-xs text-green-700">
                      <span className="font-semibold">Technologies:</span> {project.technologies}
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
            <h2 className="text-sm font-bold text-green-700 mb-3 uppercase">Publications</h2>
            <div className="space-y-3">
              {publications.map((pub) => (
                <div key={pub.id}>
                  <h3 className="text-xs font-bold text-gray-900">{pub.title}</h3>
                  <p className="text-xs text-green-700">{pub.publisher}</p>
                  <p className="text-xs text-gray-500">{pub.date}</p>
                  {pub.description && <p className="text-xs text-gray-700 mt-1">{pub.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteering */}
        {volunteering.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-green-700 mb-3 uppercase">Volunteering</h2>
            <div className="space-y-4">
              {volunteering.map((vol) => (
                <div key={vol.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-xs font-bold text-gray-900">{vol.role}</h3>
                      <p className="text-xs text-green-700 font-semibold">{vol.organization}</p>
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
          <div className="mb-6">
            <h2 className="text-sm font-bold text-green-700 mb-3 uppercase">Awards</h2>
            <div className="space-y-3">
              {awards.map((award) => (
                <div key={award.id}>
                  <h3 className="text-xs font-bold text-gray-900">{award.title}</h3>
                  <p className="text-xs text-green-700">{award.issuer}</p>
                  <p className="text-xs text-gray-500">{award.date}</p>
                  {award.description && <p className="text-xs text-gray-700 mt-1">{award.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-green-700 mb-3 uppercase">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span key={interest.id} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
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
