import type { CVData } from "@/types/cv"
import { Mail, Phone, MapPin } from "lucide-react"

interface JeremyTorresTemplateProps {
  cvData: CVData
}

export function JeremyTorresTemplate({ cvData }: JeremyTorresTemplateProps) {
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
      <div className="bg-gray-100 p-6 flex items-center">
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
          <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold mb-2 inline-block">
            {personalInfo.headline || "YOUR PROFESSION"}
          </div>
          <h1 className="text-xl font-bold text-gray-900">{personalInfo.fullName || "Your Name"}</h1>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {personalInfo.location}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Content */}
        <div className="flex-1 p-6">
          {/* Objective/Summary */}
          {summary && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase">Objective</h2>
              <p className="text-xs text-gray-700 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase">Work Experience</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase">{exp.company}</h3>
                        <p className="text-xs text-gray-600">{exp.position}</p>
                        <p className="text-xs text-gray-500">
                          {exp.startDate} - {exp.endDate}
                        </p>
                      </div>
                    </div>
                    <ul className="text-xs text-gray-700 space-y-1 mt-2">
                      {exp.description.map((desc, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">-</span>
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
              <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase">Projects</h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase">{project.name}</h3>
                        {project.url && <p className="text-xs text-gray-600">{project.url}</p>}
                        <p className="text-xs text-gray-500">
                          {project.startDate} - {project.endDate}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 mt-2">{project.description}</p>
                    {project.technologies && (
                      <p className="text-xs text-gray-600 mt-1">
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
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase">Publications</h2>
              <div className="space-y-3">
                {publications.map((pub) => (
                  <div key={pub.id}>
                    <h3 className="text-xs font-bold text-gray-900 uppercase">{pub.title}</h3>
                    <p className="text-xs text-gray-600">
                      {pub.publisher} - {pub.date}
                    </p>
                    {pub.url && <p className="text-xs text-gray-600">{pub.url}</p>}
                    <p className="text-xs text-gray-700 mt-1">{pub.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Volunteering */}
          {volunteering.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase">Volunteering</h2>
              <div className="space-y-4">
                {volunteering.map((vol) => (
                  <div key={vol.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase">{vol.organization}</h3>
                        <p className="text-xs text-gray-600">{vol.role}</p>
                        <p className="text-xs text-gray-500">
                          {vol.startDate} - {vol.endDate}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 mt-2">{vol.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {awards.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase">Awards</h2>
              <div className="space-y-3">
                {awards.map((award) => (
                  <div key={award.id}>
                    <h3 className="text-xs font-bold text-gray-900 uppercase">{award.title}</h3>
                    <p className="text-xs text-gray-600">
                      {award.issuer} - {award.date}
                    </p>
                    <p className="text-xs text-gray-700 mt-1">{award.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-1/3 bg-gray-50 p-6">
          {/* Education */}
          {education.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">Education</h3>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="text-xs font-bold text-gray-900 uppercase">{edu.institution}</h4>
                    <p className="text-xs text-gray-600">{edu.degree}</p>
                    <p className="text-xs text-gray-500">{edu.graduationYear}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">Skills</h3>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold">{skill.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-3 h-3 rounded-full ${level <= skill.level ? "bg-yellow-400" : "bg-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">Languages</h3>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between">
                    <span className="text-xs font-semibold">{lang.name}</span>
                    <span className="text-xs text-gray-600">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">Certifications</h3>
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
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">Interests</h3>
              <div className="flex flex-wrap gap-1">
                {interests.map((interest) => (
                  <span key={interest.id} className="bg-yellow-100 px-2 py-1 rounded text-xs text-yellow-800">
                    {interest.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Website */}
          {personalInfo.website && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase">Website</h3>
              <p className="text-xs text-gray-600">{personalInfo.website}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
